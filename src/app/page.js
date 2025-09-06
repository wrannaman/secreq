"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui/table";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/hooks/use-auth";
import { PublicOnly } from "@/components/auth-guard";
import { Shield, ArrowRight, Play, CheckCircle2, ShieldCheck, Sparkles, Gift, Quote } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const HOW_DIFFERENT_TABLE_ROWS = [
  {
    capability: "Primary Job",
    platforms: "Internal Program Management",
    secreq: "External Customer Response",
  },
  {
    capability: "Core Workflow",
    platforms: "Policy creation & evidence collection",
    secreq: "AI-powered answer drafting & high-fidelity Excel export",
  },
  {
    capability: "Primary Use Case",
    platforms: "Getting you SOC 2 certified (a 6-9 month process)",
    secreq: "Clearing a customer's urgent questionnaire (a 3-hour task)",
  },
  {
    capability: "Key Differentiator",
    platforms: "Broad platform for building your internal program",
    secreq: "Preserves 100% of your customer's original Excel formatting",
  },
  {
    capability: "Business Value",
    platforms: "Lets you claim you are secure and compliant",
    secreq: "Lets you prove it quickly to unblock a specific sales deal",
  },
];

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
                        "With this tool I can quickly fill out security requests and preserve the original formatting. The latest one saved me about 4 hours and we landed a 6 figure deal!"
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
              The Fastest Way to Get Past Enterprise Security Review.
            </h2>
            <p className="text-xl md:text-2xl text-foreground font-semibold leading-relaxed">
              Secreq is the scalpel for scaling B2B teams. We combine AI‑drafting with perfect Excel formatting to get your enterprise deals un‑stuck and closed.
            </p>
            <div className="mt-4 mb-6 flex flex-wrap items-center justify-center gap-2">
              <Badge variant="outline">Deal Velocity</Badge>
              <Badge variant="outline">Never breaks their file</Badge>
              <Badge variant="outline">AI with citations</Badge>
              <Badge variant="outline">First one free</Badge>
            </div>
            <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">Answer once and reuse across vendors. Your formatting stays intact.</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/auth/login">
                  Clear My First Questionnaire Free
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

        {/* The Bottleneck */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-foreground">Your Biggest Deal Just Hit a Brick Wall.</h3>
            </div>
            <p className="max-w-4xl mx-auto text-lg text-muted-foreground text-center">
              Your pipeline is finally moving. Then it happens: your enterprise champion sends “the file.” A 400‑row Excel monster that brings your motion to a dead stop. Engineers get pulled off the product, momentum dies, and your revenue forecast slips.
            </p>
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
                  <CardTitle className="flex items-center gap-2 text-xl"><Sparkles className="h-5 w-5 text-primary" /> Turn 3 Weeks into 3 Hours</CardTitle>
                  <CardDescription>AI‑drafted answers with citations so you review, approve, and ship fast.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl"><ShieldCheck className="h-5 w-5 text-primary" /> Never Break Their File</CardTitle>
                  <CardDescription>The #1 rejection reason is broken formatting. We preserve their original file perfectly.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl"><CheckCircle2 className="h-5 w-5 text-primary" /> Stop Derailing Engineers</CardTitle>
                  <CardDescription>Keep product moving. Review in a spreadsheet‑style workbench without pulling devs.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl"><CheckCircle2 className="h-5 w-5 text-primary" /> Approve on the First Pass</CardTitle>
                  <CardDescription>Preserve complex Excel, SIG/SIG‑Lite, and CSV formatting so reviewers say “yes.”</CardDescription>
                </CardHeader>
              </Card>
              <Card className="sm:col-span-2 lg:col-span-1 border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl"><Sparkles className="h-5 w-5 text-primary" /> Build a Reusable Control Library</CardTitle>
                  <CardDescription>Answer once. Reuse across vendors with audit‑ready language and citations.</CardDescription>
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

        {/* The Secreq Workflow */}
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
              <h3 className="text-3xl font-bold text-foreground mb-4">Your First One is On Us.</h3>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left column - Core + Pricing */}
                <div>
                  <Card className="p-6">
                    <h4 className="text-xl font-semibold text-foreground mb-4">What We'll Do</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Upload the file that's stalling your deal. We'll draft answers with citations.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">We preserve the original Excel/SIG formatting so it passes first review.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">You review in a spreadsheet‑style workbench and ship.</span>
                      </li>
                    </ul>
                  </Card>
                </div>

                {/* Right column - Bonuses + Guarantee */}
                <div className="space-y-6">
                  <Card className="p-6">
                    <h4 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Gift className="h-5 w-5 text-primary" />
                      What It Costs
                    </h4>
                    <p className="text-sm text-muted-foreground">Your first questionnaire is free. No credit card. No commitment. Our only goal is to prove we can get your deal moving again.</p>
                  </Card>

                  <Card className="p-6 border-primary/20">
                    <h4 className="text-lg font-semibold text-foreground mb-3">Simple Guarantee</h4>
                    <p className="text-sm text-muted-foreground mb-4">If this isn't faster than manual work, walk away. No strings.</p>
                    <Button size="lg" asChild className="w-full">
                      <Link href="/auth/login">Unblock My Deal <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Secreq? */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground">Why Secreq?</h3>
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
                <h4 className="font-semibold text-foreground">4) Pay only for help</h4>
                <p>You pay <span className="font-semibold text-foreground">only</span> for questions where we provide AI suggestions. If we can&apos;t help or you leave it blank, no charge.</p>
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

        {/* Secreq vs. All-in-One Compliance Platforms - Table */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground">Secreq vs. All-in-One Compliance Platforms</h3>
            </div>
            <div className="max-w-4xl mx-auto">
              <Table>
                <TableCaption>Where Secreq fits alongside all‑in‑one compliance platforms</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Capability</TableHead>
                    <TableHead>All‑in‑one platforms</TableHead>
                    <TableHead>Secreq</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {HOW_DIFFERENT_TABLE_ROWS.map(({ capability, platforms, secreq }) => (
                    <TableRow key={capability}>
                      <TableCell className="font-medium">{capability}</TableCell>
                      <TableCell>{platforms}</TableCell>
                      <TableCell>{secreq}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                <p className="font-semibold text-foreground">What does it cost to try?</p>
                <p className="text-muted-foreground">Your first real questionnaire is free—no credit card, no commitment.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-4xl font-bold text-foreground mb-6">That security questionnaire is killing your deal. <span className="text-primary">Send us the file—let’s un‑stall it today.</span></h3>
              <p className="text-xl text-muted-foreground mb-8">Your first real questionnaire is free. No credit card.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-lg px-12 py-6">
                  <Link href="/auth/login">Unblock My Deal<ArrowRight className="ml-2 h-5 w-5" /></Link>
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