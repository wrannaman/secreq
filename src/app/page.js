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
              Stop Losing Deals to Security Questionnaires.
            </h2>
            <p className="text-xl md:text-2xl text-foreground font-semibold leading-relaxed">
              The AI-powered workbench that preserves your customer's formatting, so you can answer in hours, not weeks.
            </p>
            <div className="mt-4 mb-6 flex flex-wrap items-center justify-center gap-2">
              <Badge variant="outline">No seats</Badge>
              <Badge variant="outline">No contracts</Badge>
              <Badge variant="outline">Self‑serve</Badge>
              <Badge variant="outline">Made + hosted in USA 🇺🇸</Badge>
            </div>
            <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">Upload, collaborate, export. Your Excel format stays intact.</p>

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

        {/* The Bottleneck */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-foreground">The Bottleneck</h3>
            </div>
            <p className="max-w-4xl mx-auto text-lg text-muted-foreground text-center">
              You're a scaling B2B SaaS company. You're starting to attract enterprise customers. But every big deal gets stuck at the same place: the customer's massive, non-standard Excel security questionnaire. It kills your deal velocity, pulls your engineers off the product, and turns your sales team into project managers.
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
                    alt="Secreq Demo - AI filling out security questionnaires"
                    width={1200}
                    height={675}
                    className="w-full h-auto"
                  />
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Create an Answer Bank</CardTitle>
                  <CardDescription>Upload your policies and past answers to power precise drafts with citations.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/50 overflow-hidden">
                <div className="relative">
                  <Image
                    src="/dash-min.png"
                    alt="Dashboard overview"
                    width={1200}
                    height={675}
                    className="w-full h-auto"
                  />
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Dashboard</CardTitle>
                  <CardDescription>Track questionnaires, status, and progress at a glance.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/50 overflow-hidden">
                <div className="relative">
                  <Image src="/workbench-min.png" alt="AI Workbench formatting preserved" width={1200} height={675} className="w-full h-auto" />
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">AI Workbench</CardTitle>
                  <CardDescription>Draft answers in a spreadsheet UI while preserving Excel formatting.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/50 overflow-hidden">
                <div className="relative">
                  <Image src="/team-min.png" alt="Add your team" width={1200} height={675} className="w-full h-auto" />
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Add your Team</CardTitle>
                  <CardDescription>Invite collaborators and work together with assignments and review.</CardDescription>
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
                  <CardTitle className="flex items-center gap-2 text-xl"><Sparkles className="h-5 w-5 text-primary" /> 10–50× faster</CardTitle>
                  <CardDescription>AI suggests answers from your policies. You review and approve in a collaborative workbench.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl"><ShieldCheck className="h-5 w-5 text-primary" /> Excel format preserved</CardTitle>
                  <CardDescription>Upload your customer&apos;s Excel file. We preserve the exact formatting, complex structures, and export it back perfectly.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl"><CheckCircle2 className="h-5 w-5 text-primary" /> Team collaboration</CardTitle>
                  <CardDescription>Spreadsheet‑style <span className="font-medium text-foreground">AI Workbench</span> with comments, assignments, and bulk actions. Multiple people can work together.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl"><CheckCircle2 className="h-5 w-5 text-primary" /> Usage‑based pricing</CardTitle>
                  <CardDescription>Only pay when we help with a suggested answer. First 3 questionnaires are free.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="sm:col-span-2 lg:col-span-1 border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl"><Sparkles className="h-5 w-5 text-primary" /> AI with citations</CardTitle>
                  <CardDescription>Every suggested answer shows exactly which documents it came from, with confidence scores.</CardDescription>
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
              <h3 className="text-3xl font-bold text-foreground mb-2">The Secreq Workflow</h3>
            </div>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Upload Anything</CardTitle>
                  <CardDescription>Your customer's original Excel file (no matter how complex) and your existing security documents to create your Control Library.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">AI‑Draft Answers</CardTitle>
                  <CardDescription>Our AI suggests answers from your documents directly into a spreadsheet‑like UI, with full citations so you can verify everything.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Export a Perfect File</CardTitle>
                  <CardDescription>Download the completed questionnaire with 100% of your customer's original formatting, macros, and tabs intact. No manual rework required.</CardDescription>
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
                        <span className="text-sm">AI suggests answers using <em>your</em> docs</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm"><strong>Collaborative Workbench</strong> preserves Excel format</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Unlimited teammates, no seat pricing</span>
                      </li>
                    </ul>

                    <div className="border-t pt-6">
                      <h4 className="text-xl font-semibold text-foreground mb-3">Pricing</h4>
                      <p className="text-sm text-muted-foreground mb-3">Usage‑based — only pay when we help with a suggested answer.</p>
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
                      <li><strong>Import Assist:</strong> We help ingest your policy docs</li>
                      <li><strong>Answer Library:</strong> SOC 2, ISO 27001, CAIQ mappings</li>
                      <li><strong>Style Guardrails:</strong> Tone/term config for your voice</li>
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

        {/* Why Secreq? */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground">Why Secreq?</h3>
            </div>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 text-muted-foreground text-lg">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Never Break Their File</h4>
                <p>We are obsessed with preserving your customer's original Excel formatting. This is our core promise.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Build a Reusable Library</h4>
                <p>Answer once, reuse everywhere. Secreq learns from your policies and past questionnaires to create a single source of truth.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">AI with Citations</h4>
                <p>No black boxes. Every AI‑suggested answer is traced back to your source documents, giving you full confidence and control.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Built for Collaboration</h4>
                <p>Your sales, security, and engineering teams can work together in a single, shared workbench to get the job done faster.</p>
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
            <div className="max-w-6xl mx-auto">
              <Card className="border-border/50">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[220px] text-foreground">Capability</TableHead>
                        <TableHead>All-in-One Platforms (Vanta, Drata, etc.)</TableHead>
                        <TableHead>Secreq (The Tactical Workbench)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {HOW_DIFFERENT_TABLE_ROWS.map((row) => (
                        <TableRow key={row.capability}>
                          <TableCell className="font-medium text-foreground">{row.capability}</TableCell>
                          <TableCell className="text-muted-foreground">{row.platforms}</TableCell>
                          <TableCell className="text-muted-foreground">{row.secreq}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableCaption>Comparison of focus and outcomes: platforms vs. Secreq.</TableCaption>
                  </Table>
                </CardContent>
              </Card>
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
                <p className="font-semibold text-foreground">What file types can I upload?</p>
                <p className="text-muted-foreground">Policies as PDF/DOCX/Markdown; questionnaires as CSV/XLSX/GS. Portal exports work fine.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">What if a question needs custom info?</p>
                <p className="text-muted-foreground">Mark it <span className="font-semibold text-foreground">Needs Info</span> or assign an owner. You’re only billed for drafted answers.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">How accurate are the answers?</p>
                <p className="text-muted-foreground">We retrieve from your docs and show <span className="font-semibold text-foreground">citations + confidence</span>. You approve every answer.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Do you store our questionnaires?</p>
                <p className="text-muted-foreground">Yes, inside your account for reuse and audit trail. You can export everything anytime.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Will you train on our data?</p>
                <p className="text-muted-foreground">No. Your documents are used solely to serve your workspace.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Do you integrate with GRC platforms?</p>
                <p className="text-muted-foreground">CSV/XLSX covers most pipelines today. Direct integrations are on the roadmap—tell us what you need.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">What if we can’t upload documents due to policy?</p>
                <p className="text-muted-foreground">Use <span className="font-semibold text-foreground">Redacted Mode</span> (paste only what’s needed) or join the <span className="font-semibold text-foreground">Local/CLI waitlist</span> for on‑prem processing.</p>
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