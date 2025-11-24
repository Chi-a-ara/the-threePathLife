import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, CreditCard, MessageSquare, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

export default function MatrixResult() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const matrixId = parseInt(id || "0", 10);
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error } = trpc.matrix.getById.useQuery(
    { id: matrixId },
    { enabled: !!matrixId }
  );

  const createCheckoutMutation = trpc.payment.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast.info("Redirecting to payment...");
        window.open(data.checkoutUrl, "_blank");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create checkout session");
    },
  });

  const handlePayment = (productType: "full_unlock" | "single_question" | "monthly_subscription") => {
    if (!isAuthenticated) {
      toast.error("Please log in to continue");
      window.location.href = getLoginUrl();
      return;
    }

    createCheckoutMutation.mutate({
      productType,
      matrixId,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[oklch(0.08_0.02_280)] via-[oklch(0.12_0.04_290)] to-[oklch(0.08_0.02_270)] flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-xl text-muted-foreground">Loading your matrix...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[oklch(0.08_0.02_280)] via-[oklch(0.12_0.04_290)] to-[oklch(0.08_0.02_270)] flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Matrix Not Found</CardTitle>
            <CardDescription>The requested matrix could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")} className="w-full">
              Calculate New Matrix
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { matrix, calculation, hasAccess } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.08_0.02_280)] via-[oklch(0.12_0.04_290)] to-[oklch(0.08_0.02_270)]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            {matrix.name}'s Destiny Matrix
          </h1>
          <p className="text-muted-foreground">
            Born: {matrix.birthDate}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Matrix Visualization */}
          <div className="lg:col-span-2">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Your Sacred Numbers</CardTitle>
                <CardDescription>
                  These are the 22 arcana numbers calculated from your birth date
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Matrix Grid Display */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-center">Day</Badge>
                    <div className="flex items-center justify-center w-full h-20 rounded-lg bg-primary/20 border-2 border-primary">
                      <span className="text-3xl font-bold text-primary">{calculation.day}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-center">Month</Badge>
                    <div className="flex items-center justify-center w-full h-20 rounded-lg bg-primary/20 border-2 border-primary">
                      <span className="text-3xl font-bold text-primary">{calculation.month}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-center">Year</Badge>
                    <div className="flex items-center justify-center w-full h-20 rounded-lg bg-primary/20 border-2 border-primary">
                      <span className="text-3xl font-bold text-primary">{calculation.year}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-center bg-secondary/20">Destiny</Badge>
                    <div className="flex items-center justify-center w-full h-20 rounded-lg bg-secondary/20 border-2 border-secondary">
                      <span className="text-3xl font-bold text-secondary">{calculation.destiny}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-center">Purpose</Badge>
                    <div className="flex items-center justify-center w-full h-20 rounded-lg bg-primary/20 border-2 border-primary">
                      <span className="text-3xl font-bold text-primary">{calculation.purpose}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-center">Money</Badge>
                    <div className="flex items-center justify-center w-full h-20 rounded-lg bg-primary/20 border-2 border-primary">
                      <span className="text-3xl font-bold text-primary">{calculation.money}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-center">Health</Badge>
                    <div className="flex items-center justify-center w-full h-20 rounded-lg bg-primary/20 border-2 border-primary">
                      <span className="text-3xl font-bold text-primary">{calculation.health}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-center">Talents</Badge>
                    <div className="flex items-center justify-center w-full h-20 rounded-lg bg-primary/20 border-2 border-primary">
                      <span className="text-3xl font-bold text-primary">{calculation.talents}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-center">Love</Badge>
                    <div className="flex items-center justify-center w-full h-20 rounded-lg bg-primary/20 border-2 border-primary">
                      <span className="text-3xl font-bold text-primary">{calculation.relationships}</span>
                    </div>
                  </div>
                </div>

                {/* Locked AI Interpretation */}
                {!hasAccess && (
                  <div className="mt-6 relative">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                      <div className="text-center p-6">
                        <Lock className="w-12 h-12 text-primary mx-auto mb-3" />
                        <h3 className="text-xl font-bold mb-2">Unlock AI Interpretation</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Get deep insights about your sacred numbers
                        </p>
                      </div>
                    </div>
                    <div className="blur-sm p-6 bg-muted/20 rounded-lg">
                      <h4 className="font-semibold mb-2">Your Destiny Number (22) - The Fool</h4>
                      <p className="text-sm text-muted-foreground">
                        The Fool represents new beginnings, spontaneity, and unlimited potential. In your matrix, this powerful arcana suggests...
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Pricing Sidebar */}
          <div className="space-y-4">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Understand Your Sacred Numbers</CardTitle>
                </div>
                <CardDescription>
                  Unlock AI-powered interpretations of your matrix
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* One-Time Unlock */}
                <Card className="border-primary/40">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Full Matrix Unlock</CardTitle>
                      <Badge variant="secondary">Best Value</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">€7.99</p>
                      <p className="text-xs text-muted-foreground">one-time payment</p>
                    </div>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>✓ Complete AI interpretation</li>
                      <li>✓ All 22 arcana meanings</li>
                      <li>✓ Life purpose & talents</li>
                      <li>✓ Downloadable PDF report</li>
                      <li>✓ Lifetime access</li>
                    </ul>
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => handlePayment("full_unlock")}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Unlock Now
                    </Button>
                  </CardContent>
                </Card>

                {/* Pay Per Question */}
                <Card className="border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Single Question</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">€4.00</p>
                      <p className="text-xs text-muted-foreground">per question</p>
                    </div>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>✓ Ask specific questions</li>
                      <li>✓ AI-powered answers</li>
                      <li>✓ Based on your matrix</li>
                    </ul>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handlePayment("single_question")}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Ask Question
                    </Button>
                  </CardContent>
                </Card>

                {/* Monthly Subscription */}
                <Card className="border-secondary/40 bg-gradient-to-br from-secondary/5 to-primary/5">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Unlimited Access</CardTitle>
                      <Badge className="bg-secondary text-secondary-foreground">Premium</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-secondary">€39.90</p>
                      <p className="text-xs text-muted-foreground">per month</p>
                    </div>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>✓ Unlimited questions</li>
                      <li>✓ Multiple matrices</li>
                      <li>✓ Compatibility readings</li>
                      <li>✓ Priority AI responses</li>
                      <li>✓ Monthly forecasts</li>
                    </ul>
                    <Button 
                      variant="secondary" 
                      className="w-full" 
                      size="lg"
                      onClick={() => handlePayment("monthly_subscription")}
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      Subscribe Now
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
