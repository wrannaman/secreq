"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/hooks/use-auth";
import { PublicOnly } from "@/components/auth-guard";
import { Shield, ArrowRight, Play, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function HomeContent() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">SecReq</h1>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button asChild variant="outline">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
              The fastest way to fill out
              <span className="text-primary"> security questionnaires</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              AI-powered responses from your own documentation. Cut response time from weeks to minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/auth/login">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 group"
                onClick={() => setShowDemo(true)}
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Demo Video */}
            <div className="relative max-w-4xl mx-auto">
              <div className="rounded-lg overflow-hidden shadow-2xl border border-border/50">
                <video
                  className="w-full h-auto"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/workbench-min.png"
                >
                  <source src="/demo.mp4" type="video/mp4" />
                  {/* Fallback to GIF if video doesn't work */}
                  <Image
                    src="/demo-min.gif"
                    alt="SecReq Demo - AI filling out security questionnaires"
                    width={1200}
                    height={675}
                    className="w-full h-auto"
                  />
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Complete questionnaires in minutes, not weeks
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload your policies once, answer hundreds of questionnaires automatically
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto">
              {/* AI Workbench */}
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardContent className="p-0">
                  <Image
                    src="/workbench-min.png"
                    alt="AI Workbench - Edit and approve responses"
                    width={900}
                    height={560}
                    className="w-full h-auto"
                  />
                </CardContent>
                <div className="p-6 space-y-3">
                  <h4 className="text-2xl font-semibold text-foreground">AI Workbench</h4>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Review, edit, and approve AI-generated responses in an intuitive spreadsheet interface. See confidence and citations for every answer.
                  </p>
                </div>
              </Card>

              {/* Smart Data Management */}
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardContent className="p-0">
                  <Image
                    src="/data-min.png"
                    alt="Dataset management interface"
                    width={900}
                    height={560}
                    className="w-full h-auto"
                  />
                </CardContent>
                <div className="p-6 space-y-3">
                  <h4 className="text-2xl font-semibold text-foreground">Smart Data Management</h4>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Upload policies once. Our AI learns your org to produce accurate, consistent responses.
                  </p>
                </div>
              </Card>

              {/* Team Collaboration */}
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardContent className="p-0">
                  <Image
                    src="/team-min.png"
                    alt="Team collaboration and management"
                    width={900}
                    height={560}
                    className="w-full h-auto"
                  />
                </CardContent>
                <div className="p-6 space-y-3">
                  <h4 className="text-2xl font-semibold text-foreground">Team Collaboration</h4>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Invite your team, manage roles, and track progress together.
                  </p>
                </div>
              </Card>

              {/* Progress Dashboard */}
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardContent className="p-0">
                  <Image
                    src="/dash-min.png"
                    alt="Dashboard overview with progress tracking"
                    width={900}
                    height={560}
                    className="w-full h-auto"
                  />
                </CardContent>
                <div className="p-6 space-y-3">
                  <h4 className="text-2xl font-semibold text-foreground">Progress Dashboard</h4>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    See status at a glance and keep work moving with clear metrics.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-4xl font-bold text-foreground mb-6">
                Ready to transform your security questionnaire process?
              </h3>
              <p className="text-xl text-muted-foreground mb-8">
                Join organizations already saving hundreds of hours with AI-powered compliance
              </p>
              <Button size="lg" asChild className="text-lg px-12 py-6">
                <Link href="/auth/login">
                  Start Free Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 bg-background">
        <div className="container mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 SecReq. AI-powered security compliance made simple.</p>
        </div>
      </footer>

      {/* Demo Video Modal */}
      <Dialog open={showDemo} onOpenChange={setShowDemo}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black">
          <DialogHeader className="sr-only">
            <DialogTitle>SecReq Demo Video</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video">
            <video
              className="w-full h-full"
              controls
              autoPlay
              muted
              playsInline
            >
              <source src="/demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>
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