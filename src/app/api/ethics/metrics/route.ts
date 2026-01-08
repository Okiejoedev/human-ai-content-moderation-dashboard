import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Get all metrics
    const metrics = await db.ethicsMetric.findMany();

    // Build metrics object
    const metricsData: any = {
      falsePositiveRate: 0,
      falseNegativeRate: 0,
      overrideFrequency: 0,
      totalReviewed: 0,
    };

    metrics.forEach((metric) => {
      if (metric.metricType === 'false_positive_rate') {
        metricsData.falsePositiveRate = metric.value;
      } else if (metric.metricType === 'false_negative_rate') {
        metricsData.falseNegativeRate = metric.value;
      } else if (metric.metricType === 'override_frequency') {
        metricsData.overrideFrequency = metric.value;
      } else if (metric.metricType === 'total_reviewed') {
        metricsData.totalReviewed = metric.value;
      }
    });

    // Calculate false negative rate (harmful content missed by AI)
    // This is a simplified calculation - in production, you'd need ground truth data
    const allAnalyses = await db.aiAnalysis.findMany({
      include: {
        post: {
          include: {
            humanReview: true,
          },
        },
      },
    });

    const harmfulButNotFlagged = allAnalyses.filter(
      (a) => !a.flagged && a.predictedLabel !== 'safe' && a.post.humanReview?.action === 'remove'
    ).length;

    const totalHarmful = allAnalyses.filter(
      (a) => a.predictedLabel !== 'safe'
    ).length;

    if (totalHarmful > 0) {
      metricsData.falseNegativeRate = harmfulButNotFlagged / totalHarmful;
    }

    return NextResponse.json({ metrics: metricsData });
  } catch (error) {
    console.error('Error fetching ethics metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ethics metrics' },
      { status: 500 }
    );
  }
}
