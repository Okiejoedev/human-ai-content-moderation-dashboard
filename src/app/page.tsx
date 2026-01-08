'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
  MessageSquare,
  Shield,
  BarChart3,
  Eye,
  Upload,
  Loader2,
} from 'lucide-react';

interface ContentPost {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
}

interface AiAnalysis {
  id: string;
  postId: string;
  predictedLabel: string;
  confidence: number;
  explanation: string;
  flagged: boolean;
  createdAt: string;
}

interface HumanReview {
  id: string;
  postId: string;
  action: string;
  finalLabel?: string;
  overrideReason?: string;
  reviewerName?: string;
  reviewedAt: string;
}

export default function Home() {
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedContent, setSubmittedContent] = useState<ContentPost | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null);
  const [flaggedPosts, setFlaggedPosts] = useState<any[]>([]);
  const [ethicsMetrics, setEthicsMetrics] = useState({
    falsePositiveRate: 0,
    falseNegativeRate: 0,
    overrideFrequency: 0,
    totalReviewed: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);

    try {
      // Submit content
      const postResponse = await fetch('/api/content/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          authorName: authorName || 'Anonymous',
        }),
      });

      const postData = await postResponse.json();
      setSubmittedContent(postData.post);

      // Get AI analysis
      const analysisResponse = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: postData.post.id }),
      });

      const analysisData = await analysisResponse.json();
      setAiAnalysis(analysisData.analysis);

      // Refresh flagged posts if content was flagged
      if (analysisData.analysis?.flagged) {
        fetchFlaggedPosts();
        fetchEthicsMetrics();
      }

      setContent('');
      setAuthorName('');
    } catch (error) {
      console.error('Error submitting content:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchFlaggedPosts = async () => {
    try {
      const response = await fetch('/api/content/flagged');
      const data = await response.json();
      setFlaggedPosts(data.posts);
    } catch (error) {
      console.error('Error fetching flagged posts:', error);
    }
  };

  const fetchEthicsMetrics = async () => {
    try {
      const response = await fetch('/api/ethics/metrics');
      const data = await response.json();
      setEthicsMetrics(data.metrics);
    } catch (error) {
      console.error('Error fetching ethics metrics:', error);
    }
  };

  const handleReview = async (postId: string, action: string, overrideReason?: string) => {
    try {
      await fetch('/api/content/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          action,
          overrideReason,
          reviewerName: 'Moderator',
        }),
      });

      await fetchFlaggedPosts();
      await fetchEthicsMetrics();
    } catch (error) {
      console.error('Error reviewing content:', error);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return 'bg-red-500';
    if (confidence >= 0.4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.7) return 'High';
    if (confidence >= 0.4) return 'Medium';
    return 'Low';
  };

  const getLabelColor = (label: string) => {
    switch (label) {
      case 'hate_speech':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'harassment':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'violence':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'safe':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const highlightKeywords = (text: string, explanation: string) => {
    // Extract keywords from explanation (simple approach)
    const keywords = explanation
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k && k.length > 2);

    if (keywords.length === 0) return text;

    let highlightedText = text;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="bg-red-200 px-1 rounded">$1</mark>'
      );
    });

    return highlightedText;
  };

  // Initial load
  useState(() => {
    fetchFlaggedPosts();
    fetchEthicsMetrics();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Human-Centered AI Content Moderation</h1>
                <p className="text-sm text-muted-foreground">
                  AI assists, Humans decide
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="gap-2">
                <Eye className="h-4 w-4" />
                Human-in-the-Loop
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="submit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="submit" className="gap-2">
              <Upload className="h-4 w-4" />
              Submit Content
            </TabsTrigger>
            <TabsTrigger value="review" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Review Flagged ({flaggedPosts.length})
            </TabsTrigger>
            <TabsTrigger value="ethics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Ethics Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Submission</CardTitle>
                <CardDescription>
                  Submit text content for AI-assisted moderation analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="author" className="text-sm font-medium">
                      Author Name (Optional)
                    </label>
                    <Input
                      id="author"
                      placeholder="Your name"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="content" className="text-sm font-medium">
                      Content
                    </label>
                    <Textarea
                      id="content"
                      placeholder="Enter your content here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting || !content.trim()} className="w-full">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Submit for Analysis
                      </>
                    )}
                  </Button>
                </form>

                {aiAnalysis && submittedContent && (
                  <div className="mt-6 space-y-4">
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Analysis Result</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge className={getLabelColor(aiAnalysis.predictedLabel)}>
                            {aiAnalysis.predictedLabel.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Confidence: {(aiAnalysis.confidence * 100).toFixed(1)}%
                          </span>
                          <Badge
                            variant={aiAnalysis.flagged ? 'destructive' : 'secondary'}
                            className="gap-1"
                          >
                            {aiAnalysis.flagged ? (
                              <>
                                <AlertTriangle className="h-3 w-3" />
                                Flagged for Review
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-3 w-3" />
                                Auto-Approved
                              </>
                            )}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Confidence Level</span>
                            <span className="font-medium">{getConfidenceLevel(aiAnalysis.confidence)}</span>
                          </div>
                          <Progress value={aiAnalysis.confidence * 100} className="h-2" />
                        </div>

                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>AI Explanation:</strong> {aiAnalysis.explanation}
                          </AlertDescription>
                        </Alert>

                        {aiAnalysis.flagged && (
                          <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              This content has been flagged for human review due to high confidence
                              detection of potentially harmful content. The content will be reviewed
                              by a human moderator before any final decision is made.
                            </AlertDescription>
                          </Alert>
                        )}

                        {!aiAnalysis.flagged && (
                          <Alert className="border-green-500">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <AlertDescription className="text-green-700">
                              This content appears safe based on AI analysis and has been
                              automatically approved. Human review is not required, but moderators
                              can still review this content if needed.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Example Content for Testing</CardTitle>
                <CardDescription>
                  Click on any example to load it into the submission form
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    {
                      label: 'Hate Speech',
                      content: 'These people are disgusting and should be eliminated from society.',
                    },
                    {
                      label: 'Harassment',
                      content: 'You are worthless and nobody likes you. Go away and never come back.',
                    },
                    {
                      label: 'Violence',
                      content: 'We need to fight them and use violence to solve this problem.',
                    },
                    {
                      label: 'Safe - Normal Conversation',
                      content: 'I had a great day at the beach with my friends yesterday!',
                    },
                    {
                      label: 'Safe - Political Speech',
                      content: 'I believe we need better policies to address economic inequality.',
                    },
                  ].map((example) => (
                    <Button
                      key={example.label}
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() => setContent(example.content)}
                    >
                      <span className="font-medium">{example.label}:</span>
                      <span className="ml-2 text-muted-foreground truncate">{example.content}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Human Review Dashboard</CardTitle>
                <CardDescription>
                  Review AI-flagged content and make final moderation decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {flaggedPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Flagged Content</h3>
                    <p className="text-muted-foreground">
                      All content has been reviewed or no content has been flagged yet.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-4">
                      {flaggedPosts.map((item) => (
                        <Card key={item.post.id} className="border-l-4 border-l-red-500">
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline">
                                      {item.post.authorName || 'Anonymous'}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(item.post.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="bg-muted p-4 rounded-lg">
                                    <p
                                      className="text-sm leading-relaxed"
                                      dangerouslySetInnerHTML={{
                                        __html: highlightKeywords(
                                          item.post.content,
                                          item.analysis.explanation
                                        ),
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="flex flex-wrap items-center gap-3">
                                  <Badge className={getLabelColor(item.analysis.predictedLabel)}>
                                    AI: {item.analysis.predictedLabel.replace('_', ' ').toUpperCase()}
                                  </Badge>
                                  <div className="flex items-center gap-2">
                                    <Progress
                                      value={item.analysis.confidence * 100}
                                      className="w-24 h-2"
                                    />
                                    <span className="text-xs font-medium">
                                      {(item.analysis.confidence * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                  <Badge
                                    variant={item.analysis.confidence >= 0.7 ? 'destructive' : 'secondary'}
                                  >
                                    {getConfidenceLevel(item.analysis.confidence)} Confidence
                                  </Badge>
                                </div>

                                <Alert>
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertDescription>
                                    <strong>AI Reasoning:</strong> {item.analysis.explanation}
                                  </AlertDescription>
                                </Alert>

                                {item.analysis.confidence < 0.7 && (
                                  <Alert className="border-yellow-500">
                                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                    <AlertDescription className="text-yellow-700">
                                      <strong>Low Confidence Warning:</strong> AI is uncertain about
                                      this classification. Human judgment is strongly recommended.
                                    </AlertDescription>
                                  </Alert>
                                )}
                              </div>

                              <Separator />

                              <div className="flex flex-wrap gap-2">
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => handleReview(item.post.id, 'approve')}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Approve Content
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => handleReview(item.post.id, 'remove')}
                                >
                                  <XCircle className="h-4 w-4" />
                                  Remove Content
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => {
                                    const reason = prompt('Reason for override:');
                                    if (reason) handleReview(item.post.id, 'override', reason);
                                  }}
                                >
                                  <RotateCcw className="h-4 w-4" />
                                  Override AI
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ethics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ethics & Fairness Dashboard</CardTitle>
                <CardDescription>
                  Monitor ethical metrics and ensure fair content moderation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>False Positive Rate</CardDescription>
                      <CardTitle className="text-3xl">
                        {(ethicsMetrics.falsePositiveRate * 100).toFixed(1)}%
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Safe content incorrectly flagged as harmful
                      </p>
                      <Progress value={ethicsMetrics.falsePositiveRate * 100} className="mt-3" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>False Negative Rate</CardDescription>
                      <CardTitle className="text-3xl">
                        {(ethicsMetrics.falseNegativeRate * 100).toFixed(1)}%
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Harmful content missed by AI
                      </p>
                      <Progress value={ethicsMetrics.falseNegativeRate * 100} className="mt-3" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Override Frequency</CardDescription>
                      <CardTitle className="text-3xl">
                        {(ethicsMetrics.overrideFrequency * 100).toFixed(1)}%
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Human moderators overriding AI decisions
                      </p>
                      <Progress value={ethicsMetrics.overrideFrequency * 100} className="mt-3" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Total Reviewed</CardDescription>
                      <CardTitle className="text-3xl">
                        {ethicsMetrics.totalReviewed}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Total content items reviewed by humans
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader className="pb-3">
                      <CardTitle>Ethical Safeguards</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Human-in-the-Loop</p>
                            <p className="text-sm text-muted-foreground">
                              All AI decisions require human confirmation before enforcement
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Transparency</p>
                            <p className="text-sm text-muted-foreground">
                              AI confidence scores and reasoning are always visible
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Accountability</p>
                            <p className="text-sm text-muted-foreground">
                              All decisions (AI and human) are logged and traceable
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Free Speech Protection</p>
                            <p className="text-sm text-muted-foreground">
                              AI does not auto-delete; humans make final decisions
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Human-Centered AI Content Moderation System</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI assists, Humans decide — Putting people in control of content decisions
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
