import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';

const CONFIDENCE_THRESHOLD = 0.7;

async function analyzeContentWithAI(content: string) {
  const zai = await ZAI.create();

  const systemPrompt = `You are a content moderation AI assistant. Analyze the given content and classify it into one of these categories:
- hate_speech: Content that promotes violence, hatred, or discrimination against groups based on race, ethnicity, religion, gender, sexual orientation, etc.
- harassment: Content that targets individuals with abusive, threatening, or intimidating language
- violence: Content that promotes, incites, or describes physical violence
- safe: Content that is harmless and appropriate for general audiences

Respond ONLY in JSON format with this structure:
{
  "predicted_label": "category",
  "confidence": 0.00-1.00,
  "explanation": "brief explanation with keywords that triggered the classification"
}`;

  try {
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Analyze this content: "${content}"`,
        },
      ],
      thinking: { type: 'disabled' },
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('Empty response from AI');
    }

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Validate structure
    if (!analysis.predicted_label || typeof analysis.confidence !== 'number') {
      throw new Error('Invalid AI response structure');
    }

    // Normalize confidence to 0-1 range
    const confidence = Math.max(0, Math.min(1, analysis.confidence));

    return {
      predictedLabel: analysis.predicted_label,
      confidence,
      explanation: analysis.explanation || 'AI analysis completed',
    };
  } catch (error) {
    console.error('AI analysis error:', error);

    // Fallback to safe classification with low confidence
    return {
      predictedLabel: 'safe',
      confidence: 0.1,
      explanation: 'Unable to analyze - defaulting to safe',
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Get the post
    const post = await db.contentPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if analysis already exists
    const existingAnalysis = await db.aiAnalysis.findUnique({
      where: { postId },
    });

    if (existingAnalysis) {
      return NextResponse.json({ analysis: existingAnalysis });
    }

    // Analyze content with AI
    const aiResult = await analyzeContentWithAI(post.content);

    // Determine if flagged based on confidence
    const flagged =
      aiResult.predictedLabel !== 'safe' && aiResult.confidence >= CONFIDENCE_THRESHOLD;

    // Store analysis
    const analysis = await db.aiAnalysis.create({
      data: {
        postId,
        predictedLabel: aiResult.predictedLabel,
        confidence: aiResult.confidence,
        explanation: aiResult.explanation,
        flagged,
      },
    });

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error analyzing content:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    );
  }
}
