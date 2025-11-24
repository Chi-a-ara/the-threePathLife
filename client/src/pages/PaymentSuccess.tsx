import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Sparkles } from "lucide-react";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // You could verify the session_id here if needed
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    console.log("Payment session:", sessionId);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.08_0.02_280)] via-[oklch(0.12_0.04_290)] to-[oklch(0.08_0.02_270)] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-primary/20 shadow-2xl shadow-primary/10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <CheckCircle className="w-20 h-20 text-primary" />
              <Sparkles className="w-8 h-8 text-secondary absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-3xl">Payment Successful!</CardTitle>
          <CardDescription className="text-lg">
            Your purchase has been completed successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/20 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              You now have access to your AI-powered Destiny Matrix interpretation
            </p>
            <p className="text-xs text-muted-foreground">
              A confirmation email has been sent to your registered email address
            </p>
          </div>

          <div className="space-y-2">
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => setLocation("/")}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              View My Matrix
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setLocation("/")}
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground pt-4">
            <p>Need help? Contact support at support@destinymatrix.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
