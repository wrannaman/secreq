"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/hooks/use-auth";
import { PublicOnly } from "@/components/auth-guard";
import { Shield, ArrowRight, Play, CheckCircle2, ShieldCheck, Sparkles, Gift, Quote } from "lucide-react";
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
            <h1 className="text-xl font-bold text-foreground">Secreq</h1>
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
        {/* Proof Section (Above the fold) */}
        <section className="bg-muted/30">
          <div className="container mx-auto px-6 py-8">
            <div className="text-center mb-4">
              <Badge variant="secondary">Proof</Badge>
            </div>
            <p className="text-center text-sm text-muted-foreground mb-6">
              Used by YC companies like <span className="font-semibold text-foreground">journey.io</span>
            </p>
            <div className="max-w-3xl mx-auto">
              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Image
                      src="/proof/danny.jpg"
                      alt="Danny Chu"
                      width={40}
                      height={40}
                      className="rounded-full object-cover w-10 h-10 mt-1 flex-shrink-0"
                    />
                    <Quote className="h-5 w-5 text-primary mt-2 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-base md:text-lg text-foreground">
                        "With this tool I can accurately and quickly fill out securitiy requests. The latest one saved me about 4 hours and we landed a 6 figure deal!"
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground font-medium">Danny Chu — CEO, Journey.io (YC W21)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Answer once. Export everywhere. <span className="text-primary">Flawlessly.</span>
            </h2>
            <p className="text-xl md:text-2xl text-foreground font-semibold leading-relaxed">
              The AI‑powered control library for security and compliance—preserving original formatting across Excel, SIG/SIG‑Lite, and CSV.
            </p>
            <div className="mt-4 mb-6 flex flex-wrap items-center justify-center gap-2">
              <Badge variant="outline">Control library</Badge>
              <Badge variant="outline">Flawless exports</Badge>
              <Badge variant="outline">AI with citations</Badge>
              <Badge variant="outline">Usage‑based</Badge>
            </div>
            <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">Answer once and reuse across vendors. Your formatting stays intact.</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/auth/login">
                  Start Free
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

            <div className="mt-2">
              <a
                href="https://cal.com/andrew-pierno/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
              >
                Want to chat? Book a call
              </a>
            </div>

            {/* Demo Video */}
            <div className="relative max-w-4xl mx-auto">
              <div className="relative rounded-lg overflow-hidden shadow-2xl border border-border/50">
                {/* Mask tiny white line at the top of the video */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-background z-10" />
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
                    src="/demo.gif"
                    alt="Secreq Demo - AI filling out security questionnaires"
                    width={1200}
                    height={675}
                    className="w-full h-auto"
                  />
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* See it in action */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold text-foreground">See it in action</h3>
              <p className="text-muted-foreground mt-2">A quick look at the core screens</p>
            </div>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border/50 overflow-hidden">
                <div className="relative bg-background">
                  <Image
                    src="/add-data.gif"
                    alt="Secreq Demo - Build your control library"
                    width={1200}
                    height={675}
                    className="w-full h-auto"
                  />
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Build your Control Library</CardTitle>
                  <CardDescription>Upload policies, past answers, and controls to create a single source of truth.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/50 overflow-hidden">
                <div className="relative">
                  <Image
                    src="/dash-min.png"
                    alt="Flawless exports overview"
                    width={1200}
                    height={675}
                    className="w-full h-auto"
                  />
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Flawless Exports</CardTitle>
                  <CardDescription>Export to Excel, SIG/SIG‑Lite, or CSV without breaking original formatting.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/50 overflow-hidden">
                <div className="relative">
                  <Image src="/workbench-min.png" alt="Auto‑answer and review in Workbench" width={1200} height={675} className="w-full h-auto" />
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Auto‑answer + Review</CardTitle>
                  <CardDescription>AI drafts from your library with citations. Review and edit in a spreadsheet‑style Workbench.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/50 overflow-hidden">
                <div className="relative">
                  <Image src="/team-min.png" alt="Evidence management" width={1200} height={675} className="w-full h-auto" />
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Evidence Management</CardTitle>
                  <CardDescription>Link controls to SOC 2, pen tests, and policies to keep answers fresh.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
        {/* Why teams say “yes” to Secreq */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-4">Why teams say “yes” to Secreq</h3>
            </div>
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl"><Sparkles className="h-5 w-5 text-primary" /> Central Control Library</CardTitle>
                  <CardDescription>Answer once and reuse across vendors with audit‑ready language and citations.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl"><ShieldCheck className="h-5 w-5 text-primary" /> Flawless Exports</CardTitle>
                  <CardDescription>Excel, SIG/SIG‑Lite, CSV—original formatting preserved perfectly, every time.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl"><CheckCircle2 className="h-5 w-5 text-primary" /> Evidence Freshness</CardTitle>
                  <CardDescription>Link controls to SOC 2, pen tests, and policies; track currency at a glance.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl"><CheckCircle2 className="h-5 w-5 text-primary" /> Collaborative Workbench</CardTitle>
                  <CardDescription>Spreadsheet‑style review, comments, and assignments with AI suggestions and citations.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="sm:col-span-2 lg:col-span-1 border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl"><Sparkles className="h-5 w-5 text-primary" /> Mapping Across Frameworks</CardTitle>
                  <CardDescription>Roadmap: SOC 2 ⇄ ISO ⇄ NIST mappings to reuse answers across standards.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground">Who it&apos;s for</h3>
            </div>
            <ul className="max-w-4xl mx-auto space-y-4 text-lg text-muted-foreground">
              <li>Teams getting hit with <span className="font-semibold text-foreground">customer security questionnaires</span> and due‑diligence forms.</li>
              <li>Founders who sell <span className="font-semibold text-foreground">before</span> they hire a full GRC team.</li>
              <li>Security/Compliance folks who are <span className="font-semibold text-foreground">done</span> re‑answering the same questions.</li>
            </ul>
            <p className="max-w-3xl mx-auto text-center text-lg text-muted-foreground mt-6">If that&apos;s you, this pays for itself on day one.</p>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-2">How it works</h3>
            </div>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <Badge variant="secondary" className="mb-2">Step 1</Badge>
                  <CardTitle className="text-lg">Create your Control Library</CardTitle>
                  <CardDescription>Import policies, past answers, and controls. Normalize language; link citations.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <Badge variant="secondary" className="mb-2">Step 2</Badge>
                  <CardTitle className="text-lg">Auto‑answer in the Workbench</CardTitle>
                  <CardDescription>Drop in Excel or SIG. We draft from your library with citations for quick review.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <Badge variant="secondary" className="mb-2">Step 3</Badge>
                  <CardTitle className="text-lg">Manage Evidence</CardTitle>
                  <CardDescription>Attach SOC 2, pen tests, and policy references to keep answers fresh.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <Badge variant="secondary" className="mb-2">Step 4</Badge>
                  <CardTitle className="text-lg">Export Everywhere</CardTitle>
                  <CardDescription>Excel, SIG/SIG‑Lite, CSV—preserving the original formatting perfectly.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* The offer */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-4">Our Offer</h3>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left column - Core + Pricing */}
                <div>
                  <Card className="p-6">
                    <h4 className="text-xl font-semibold text-foreground mb-4">Core</h4>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Central <strong>Control Library</strong> with reusable, audit‑ready answers</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Auto‑answer with citations in a collaborative Workbench</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm"><strong>Flawless exports</strong> to Excel, SIG/SIG‑Lite, and CSV</span>
                      </li>
                    </ul>

                    <div className="border-t pt-6">
                      <h4 className="text-xl font-semibold text-foreground mb-3">Pricing</h4>
                      <p className="text-sm text-muted-foreground mb-3">Usage‑based — pay only for AI‑drafted answers you keep.</p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span><strong>First 3 questionnaires free</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span>Never pay for blanks or questions we can&apos;t help with</span>
                        </li>
                      </ul>
                    </div>
                  </Card>
                </div>

                {/* Right column - Bonuses + Guarantee */}
                <div className="space-y-6">
                  <Card className="p-6">
                    <h4 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Gift className="h-5 w-5 text-primary" />
                      Launch Bonuses
                    </h4>
                    <ul className="space-y-3 text-sm">
                      <li><strong>Import Assist:</strong> We help ingest and normalize your control statements</li>
                      <li><strong>Starter Mappings:</strong> SOC 2, ISO 27001, CAIQ seeds for your library</li>
                      <li><strong>Style Guardrails:</strong> Tone and terminology aligned to your brand</li>
                    </ul>
                  </Card>

                  <Card className="p-6 border-primary/20">
                    <h4 className="text-lg font-semibold text-foreground mb-3">Simple Guarantee</h4>
                    <p className="text-sm text-muted-foreground mb-4">If your first draft isn&apos;t faster than manual work, keep the <strong>3 free questionnaires</strong> and walk away.</p>
                    <Button size="lg" asChild className="w-full">
                      <Link href="/auth/login">Start Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What makes Secreq different */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground">What makes Secreq different</h3>
            </div>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 text-muted-foreground text-lg">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">1) Control‑first architecture</h4>
                <p>Your reusable control statements are the source of truth. Questionnaires are just outputs.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">2) Flawless exports</h4>
                <p>We treat SIG as a compatibility layer and preserve complex Excel formatting perfectly.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">3) Evidence‑aware</h4>
                <p>Each answer links to evidence and shows freshness so reviewers trust what they read.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">4) Framework mapping (roadmap)</h4>
                <p>Map controls across SOC 2, ISO 27001, and NIST for maximum reuse.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security & privacy */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground">Security & privacy</h3>
            </div>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border/50">
                <CardContent className="pt-6 text-lg text-muted-foreground flex gap-3"><ShieldCheck className="h-6 w-6 text-primary mt-1" /> <span><span className="font-semibold text-foreground">Your data stays your data.</span> Content is <span className="font-semibold text-foreground">encrypted in transit and at rest</span> and <span className="font-semibold text-foreground">never used to train</span> shared models. It’s only used to answer <em>your</em> questions.</span></CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="pt-6 text-lg text-muted-foreground flex gap-3"><ShieldCheck className="h-6 w-6 text-primary mt-1" /> <span><span className="font-semibold text-foreground">Scoped access.</span> Role‑based access; least‑privilege by default.</span></CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="pt-6 text-lg text-muted-foreground flex gap-3"><ShieldCheck className="h-6 w-6 text-primary mt-1" /> <span><span className="font-semibold text-foreground">Data residency requests</span> available for regulated teams.</span></CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="pt-6 text-lg text-muted-foreground flex gap-3"><ShieldCheck className="h-6 w-6 text-primary mt-1" /> <span>Roadmap: <span className="font-semibold text-foreground">SOC 2</span> and <span className="font-semibold text-foreground">customer‑managed keys (BYOK)</span> are in progress—join the waitlist if that matters today.</span></CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Secreq vs. the alternatives */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground">Secreq vs. the alternatives</h3>
            </div>
            <div className="max-w-4xl mx-auto space-y-8 text-lg text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">GRC suites (Vanta/Conveyor/Loopio)</p>
                <p>Broad platforms, long rollouts, and exports that often break Excel/SIG formatting. Secreq focuses on flawless outputs from a central control library.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Internal wiki + copy/paste</p>
                <p>Slow and error‑prone. Copying loses structure and consistency. Secreq preserves original formatting and cites sources.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Freelancers/consultants</p>
                <p>Expert support but manual and inconsistent. Secreq provides AI‑assisted drafts with evidence and perfect exports.</p>
              </div>
            </div>
          </div>
        </section>



        {/* FAQs */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground">FAQs</h3>
            </div>
            <div className="max-w-4xl mx-auto space-y-8 text-lg">
              <div>
                <p className="font-semibold text-foreground">What exactly is a Control Library?</p>
                <p className="text-muted-foreground">A single source of truth for reusable, audit‑ready security answers linked to evidence.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">What formats can we export?</p>
                <p className="text-muted-foreground">Excel, SIG/SIG‑Lite, and CSV—while preserving the original formatting perfectly.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">How are answers kept fresh?</p>
                <p className="text-muted-foreground">Attach SOC 2 reports, pen tests, and policy links; we show evidence freshness.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Can we map across frameworks?</p>
                <p className="text-muted-foreground">Yes—roadmap includes SOC 2 ⇄ ISO ⇄ NIST mapping to maximize reuse.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">How does pricing work?</p>
                <p className="text-muted-foreground">Usage‑based; you pay only for AI‑drafted answers you keep. First 3 are free.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-4xl font-bold text-foreground mb-6">Stop losing weeks to copy‑paste. <span className="text-primary">Upload your next questionnaire and watch Secreq draft it in minutes.</span></h3>
              <p className="text-xl text-muted-foreground mb-8">Usage‑based. First 3 questionnaires free.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-lg px-12 py-6">
                  <Link href="/auth/login">Start Free<ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-12 py-6" onClick={() => setShowDemo(true)}>
                  <Play className="mr-2 h-5 w-5" /> Watch 90‑sec Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 bg-background">
        <div className="container mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          <p>© Secreq. AI‑powered security questionnaires made simple.</p>
        </div>
      </footer>

      {/* Demo Video Modal */}
      <Dialog open={showDemo} onOpenChange={setShowDemo}>
        <DialogContent className="max-w-4xl w-full p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Secreq Demo Video</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              className="w-full h-full"
              controls
              autoPlay
              muted
              playsInline
              preload="metadata"
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