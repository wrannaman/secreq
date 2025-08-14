"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { AuthGuard } from "@/components/auth-guard";
import { useToast } from "@/components/toast-provider";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import {
  Settings,
  Users,
  FileText,
  BarChart3,
  Plus,
  Upload,
  Database,
  Sparkles,
  CheckCircle,
  Clock,
  AlertTriangle,
  FolderOpen,
  MessageCircle
} from "lucide-react";
import { AuthenticatedNav } from "@/components/layout/authenticated-nav";

function DashboardContent() {
  const { user, currentOrganization } = useAuth();
  const { toast } = useToast();
  const [questionnaires, setQuestionnaires] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [stats, setStats] = useState({
    totalQuestionnaires: 0,
    totalQuestions: 0,
    completedQuestions: 0,
    avgConfidence: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentOrganization) {
      loadDashboardData();
    }
  }, [currentOrganization]);

  const loadDashboardData = async () => {
    const supabase = createClient()
    try {
      // Load questionnaires
      const { data: questionnaireData, error: qError } = await supabase
        .from('questionnaires')
        .select(`
          *,
          questionnaire_items(count)
        `)
        .eq('organization_id', currentOrganization.org_id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (qError) throw qError;
      setQuestionnaires(questionnaireData || []);

      // Load datasets
      const { data: datasetData, error: dError } = await supabase
        .from('datasets')
        .select('*')
        .eq('organization_id', currentOrganization.org_id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (dError) throw dError;
      setDatasets(datasetData || []);

      // Calculate stats
      const totalQuestionnaires = questionnaireData?.length || 0;
      let totalQuestions = 0;
      let completedQuestions = 0;
      let totalConfidence = 0;
      let confidenceCount = 0;

      for (const q of questionnaireData || []) {
        const { data: items } = await supabase
          .from('questionnaire_items')
          .select('status, confidence_score')
          .eq('questionnaire_id', q.id);

        totalQuestions += items?.length || 0;
        const completed = items?.filter(i => i.status === 'approved') || [];
        completedQuestions += completed.length;

        items?.forEach(item => {
          if (item.confidence_score) {
            totalConfidence += item.confidence_score;
            confidenceCount++;
          }
        });
      }

      setStats({
        totalQuestionnaires,
        totalQuestions,
        completedQuestions,
        avgConfidence: confidenceCount > 0 ? totalConfidence / confidenceCount : 0
      });

    } catch (error) {
      toast.error('Failed to load dashboard data', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'processing': return Sparkles;
      case 'draft': return Clock;
      default: return Clock;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedNav />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNav />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              SecReq Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your security questionnaires and compliance documentation
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Questionnaires
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalQuestionnaires}</div>
                <p className="text-xs text-muted-foreground">
                  Active security assessments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Questions
                </CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalQuestions}</div>
                <p className="text-xs text-muted-foreground">
                  Questions across all questionnaires
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedQuestions}</div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {stats.totalQuestions > 0 ? Math.round((stats.completedQuestions / stats.totalQuestions) * 100) : 0}% completion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Confidence
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(stats.avgConfidence * 100)}%</div>
                <p className="text-xs text-muted-foreground">
                  AI answer confidence
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Start a new security assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/questionnaires/new">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Questionnaire
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/datasets">
                    <Database className="h-4 w-4 mr-2" />
                    Manage Datasets
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/team">
                    <Users className="h-4 w-4 mr-2" />
                    Team Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>
            {/* Recent Questionnaires */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Questionnaires</CardTitle>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/questionnaires">View All</Link>
                  </Button>
                </div>
                <CardDescription>
                  Your latest security assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {questionnaires.length === 0 ? (
                  <div className="text-center py-6">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">No questionnaires yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create your first questionnaire to get started
                    </p>
                    <Button asChild size="sm">
                      <Link href="/questionnaires/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Questionnaire
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {questionnaires.map((questionnaire) => {
                      const StatusIcon = getStatusIcon(questionnaire.status);
                      return (
                        <div key={questionnaire.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(questionnaire.status)}`} />
                            <div>
                              <h4 className="font-medium text-sm">{questionnaire.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {questionnaire.questionnaire_items?.[0]?.count || 0} questions
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {questionnaire.status}
                            </Badge>
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/questionnaires/${questionnaire.id}/workshop`}>
                                Open
                              </Link>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Datasets */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Datasets</CardTitle>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/datasets">Manage</Link>
                  </Button>
                </div>
                <CardDescription>
                  Your knowledge base for AI answers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {datasets.length === 0 ? (
                  <div className="text-center py-6">
                    <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">No datasets yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload documents to help AI generate better answers
                    </p>
                    <Button asChild size="sm">
                      <Link href="/datasets">
                        <Database className="h-4 w-4 mr-2" />
                        Create Dataset
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {datasets.map((dataset) => (
                      <div key={dataset.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <FolderOpen className="h-4 w-4 text-primary" />
                          <div>
                            <h4 className="font-medium text-sm">{dataset.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {dataset.description || 'No description'}
                            </p>
                          </div>
                        </div>

                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/datasets/${dataset.id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
} 