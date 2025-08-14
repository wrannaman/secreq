import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export default function UnauthenticatedPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-foreground">
            App Template
          </Link>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome to App Template
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              This is what unauthenticated users see. Sign up to access the full platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/examples/authenticated">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Public Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🌟 Public Features
                </CardTitle>
                <CardDescription>
                  Available to all visitors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Browse Organizations</h4>
                    <p className="text-sm text-muted-foreground">
                      Discover public organizations and their content
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">View Public Content</h4>
                    <p className="text-sm text-muted-foreground">
                      Access free, publicly available content
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Theme Switching</h4>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light, dark, and system themes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🔒 Premium Features
                </CardTitle>
                <CardDescription>
                  Available after signing up
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-muted-foreground">
                      Create Organizations
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Build and manage your own organization
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-muted-foreground">
                      Team Management
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Invite and manage team members
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-muted-foreground">
                      File Uploads
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Upload and manage files with S3 integration
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-muted-foreground">
                      Billing & Subscriptions
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Manage billing and subscription plans
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription>
                Join thousands of organizations building with our template
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/auth/login">
                <Button size="lg" className="text-lg px-8 py-6">
                  Sign Up Now
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card required • Free to start
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 