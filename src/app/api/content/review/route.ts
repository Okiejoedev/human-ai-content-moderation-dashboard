import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, action, overrideReason, reviewerName } = body;

    if (!postId || !action) {
      return NextResponse.json(
        { error: 'Post ID and action are required' },
        { status: 400 }
      );
    }

    // Validate action
    const validActions = ['approve', 'remove', 'override'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Get the AI analysis
    const analysis = await db.aiAnalysis.findUnique({
      where: { postId },
      include: {
        post: true,
      },
    });

    if (!analysis) {
      return NextResponse.json(
        { error: 'AI analysis not found' },
        { status: 404 }
      );
    }

    // Determine final label based on action
    let finalLabel: string | undefined;
    if (action === 'approve') {
      finalLabel = 'safe';
    } else if (action === 'remove') {
      finalLabel = analysis.predictedLabel;
    } else if (action === 'override') {
      // Human is overriding the AI decision
      finalLabel = 'safe'; // Override typically means human disagrees with AI flagging
    }

    // Check if review already exists
    const existingReview = await db.humanReview.findUnique({
      where: { postId },
    });

    let review;

    if (existingReview) {
      // Update existing review
      review = await db.humanReview.update({
        where: { postId },
        data: {
          action,
          finalLabel,
          overrideReason,
          reviewerName: reviewerName || 'Moderator',
          reviewedAt: new Date(),
        },
      });
    } else {
      // Create new review
      review = await db.humanReview.create({
        data: {
          postId,
          action,
          finalLabel,
          overrideReason,
          reviewerName: reviewerName || 'Moderator',
        },
      });
    }

    // Update ethics metrics
    await updateEthicsMetrics(analysis, action);

    return NextResponse.json({ review });
  } catch (error) {
    console.error('Error reviewing content:', error);
    return NextResponse.json(
      { error: 'Failed to review content' },
      { status: 500 }
    );
  }
}

async function updateEthicsMetrics(analysis: any, humanAction: string) {
  const now = new Date();

  // Calculate false positive: AI flagged as harmful, but human approved
  if (analysis.flagged && humanAction === 'approve') {
    // Get all reviewed analyses
    const allReviewed = await db.humanReview.findMany({
      include: {
        post: {
          include: {
            aiAnalysis: true,
          },
        },
      },
    });

    const totalFlagged = await db.aiAnalysis.count({
      where: { flagged: true },
    });

    const falsePositives = allReviewed.filter(
      (review) =>
        review.post.aiAnalysis?.flagged && review.action === 'approve'
    ).length;

    const falsePositiveRate = totalFlagged > 0 ? falsePositives / totalFlagged : 0;

    // Update or create metric
    const existingMetric = await db.ethicsMetric.findFirst({
      where: { metricType: 'false_positive_rate' },
    });

    if (existingMetric) {
      await db.ethicsMetric.update({
        where: { id: existingMetric.id },
        data: {
          value: falsePositiveRate,
          calculatedAt: now,
        },
      });
    } else {
      await db.ethicsMetric.create({
        data: {
          metricType: 'false_positive_rate',
          value: falsePositiveRate,
          calculatedAt: now,
        },
      });
    }
  }

  // Calculate override frequency
  if (humanAction === 'override') {
    const allReviewed = await db.humanReview.findMany();
    const overrides = allReviewed.filter((r) => r.action === 'override').length;
    const overrideFrequency = allReviewed.length > 0 ? overrides / allReviewed.length : 0;

    const existingMetric = await db.ethicsMetric.findFirst({
      where: { metricType: 'override_frequency' },
    });

    if (existingMetric) {
      await db.ethicsMetric.update({
        where: { id: existingMetric.id },
        data: {
          value: overrideFrequency,
          calculatedAt: now,
        },
      });
    } else {
      await db.ethicsMetric.create({
        data: {
          metricType: 'override_frequency',
          value: overrideFrequency,
          calculatedAt: now,
        },
      });
    }
  }

  // Update total reviewed count
  const totalReviewed = await db.humanReview.count();
  const existingMetric = await db.ethicsMetric.findFirst({
    where: { metricType: 'total_reviewed' },
  });

  if (existingMetric) {
    await db.ethicsMetric.update({
      where: { id: existingMetric.id },
      data: {
        value: totalReviewed,
        calculatedAt: now,
      },
    });
  } else {
    await db.ethicsMetric.create({
      data: {
        metricType: 'total_reviewed',
        value: totalReviewed,
        calculatedAt: now,
      },
    });
  }
}
