"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/hooks/use-auth";
import { PublicOnly } from "@/components/auth-guard";
import { Shield, FileText, Users, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";

function HomeContent() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">SecReq</h1>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 flex-1">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Streamline Your Security Questionnaires
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We solve massive, expensive enterprise problems with AI-powered security compliance.
            It's more than just AI that writes responses, it's a solution to your IDP strain and shadow IT risk.
          </p>
          <Button size="lg" asChild className="text-lg px-8 py-6">
            <Link href="/auth/login">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>AI-Powered Responses</CardTitle>
              <CardDescription>
                Automatically generate accurate security questionnaire responses using your organization's documentation
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Work together with your team to review, approve, and manage security questionnaire responses
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Compliance Tracking</CardTitle>
              <CardDescription>
                Track completion rates, confidence scores, and maintain a comprehensive audit trail
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          <p>© 2024 SecReq. Powered by AI for enterprise security compliance.</p>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <PublicOnly redirectTo="/dashboard">
      <HomeContent />
    </PublicOnly>
  );
}