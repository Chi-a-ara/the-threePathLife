import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, Lock, Star, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Home() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"male" | "female">("female");
  const [, setLocation] = useLocation();

  const calculateMutation = trpc.matrix.calculate.useMutation({
    onSuccess: (data) => {
      toast.success("Your Destiny Matrix has been calculated!");
      setLocation(`/matrix/${data.id}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to calculate matrix");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate birth date format (DDMMYYYY - 8 digits)
    if (birthDate.length !== 8 || !/^\d{8}$/.test(birthDate)) {
      toast.error("Please enter date in DDMMYYYY format (e.g., 15031990)");
      return;
    }

    // Convert DDMMYYYY to DD.MM.YYYY format
    const day = birthDate.substring(0, 2);
    const month = birthDate.substring(2, 4);
    const year = birthDate.substring(4, 8);
    const formattedDate = `${day}.${month}.${year}`;

    // Basic date validation
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900 || yearNum > 2100) {
      toast.error("Please enter a valid date");
      return;
    }

    calculateMutation.mutate({ name, birthDate: formattedDate, gender });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.08_0.02_280)] via-[oklch(0.12_0.04_290)] to-[oklch(0.08_0.02_270)]">
      {/* Navigation Header */}
      <header className="border-b border-primary/10 backdrop-blur-sm bg-background/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Language Selector + Auth Buttons */}
            <div className="flex items-center gap-4">
              <LanguageSelector />
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
                  <Button variant="default" size="sm" onClick={() => setLocation("/user/home")}>
                    Dashboard
                  </Button>
                  {user.role === "admin" && (
                    <Button variant="outline" size="sm" onClick={() => setLocation("/admin")}>
                      Admin Panel
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={getLoginUrl()}>{t.nav.signIn}</a>
                  </Button>
                  <Button variant="default" size="sm" asChild>
                    <a href={getLoginUrl()}>{t.nav.signUp}</a>
                  </Button>
                </div>
              )}
            </div>

            {/* Right: Navigation Menu */}
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" size="sm" onClick={() => toast.info("Forum coming soon!")}>
                {t.nav.forum}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => toast.info("Training coming soon!")}>
                {t.nav.training}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}>
                {t.nav.calculation}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => toast.info("Services coming soon!")}>
                {t.nav.services}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => toast.info("Member area coming soon!")}>
                {t.nav.member}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => toast.info("Contact coming soon!")}>
                {t.nav.contact}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Sparkles className="w-16 h-16 text-primary animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Destiny Matrix
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the sacred numbers that reveal your life purpose, talents, and destiny through ancient numerology wisdom
          </p>
        </div>

        {/* Calculator Card */}
        <Card className="max-w-2xl mx-auto border-primary/20 shadow-2xl shadow-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Calculate Your Matrix</CardTitle>
            <CardDescription className="text-center">
              Enter your birth information to unlock your sacred numbers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Joseph Safhra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Birth Date</Label>
                <Input
                  id="birthDate"
                  type="text"
                  placeholder="15031990"
                  value={birthDate}
                  onChange={(e) => {
                    // Allow only numbers
                    const numbersOnly = e.target.value.replace(/\D/g, '');
                    // Limit to 8 digits (DDMMYYYY)
                    if (numbersOnly.length <= 8) {
                      setBirthDate(numbersOnly);
                    }
                  }}
                  maxLength={8}
                  required
                  className="bg-background/50"
                />
                <p className="text-xs text-muted-foreground">Format: DDMMYYYY (e.g., 15031990)</p>
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup value={gender} onValueChange={(value) => setGender(value as "male" | "female")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                className="w-full text-lg py-6"
                disabled={calculateMutation.isPending}
              >
                {calculateMutation.isPending ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Star className="mr-2 h-5 w-5" />
                    Calculate My Matrix
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Features section removed per user request */}
      </div>
    </div>
  );
}
