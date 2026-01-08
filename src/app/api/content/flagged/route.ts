import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const flaggedAnalyses = await db.aiAnalysis.findMany({
      where: {
        flagged: true,
      },
      include: {
        post: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Filter out posts that have already been reviewed
    const pendingPosts = flaggedAnalyses.filter((analysis) => {
      // Check if there's a human review for this post
      return !analysis.post.humanReview;
    });

    const posts = pendingPosts.map((analysis) => ({
      post: analysis.post,
      analysis: analysis,
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching flagged posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flagged posts' },
      { status: 500 }
    );
  }
}
