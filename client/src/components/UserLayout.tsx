import { ReactNode } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Calendar, 
  Hash, 
  Layers, 
  History, 
  GraduationCap, 
  ShoppingCart,
  Home,
  MessageCircle,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserLayoutProps {
  children: ReactNode;
}

const topNavItems = [
  { id: "personal", label: "Personal", icon: User, path: "/user/personal" },
  { id: "forecast", label: "Day Forecast", icon: Calendar, path: "/user/forecast" },
  { id: "numbers", label: "Numbers", icon: Hash, path: "/user/numbers" },
  { id: "aspects", label: "Aspects", icon: Layers, path: "/user/aspects" },
  { id: "calculator", label: "History Calculator", icon: History, path: "/user/calculator" },
  { id: "training", label: "Training", icon: GraduationCap, path: "/user/training" },
  { id: "purchase", label: "Purchase", icon: ShoppingCart, path: "/user/purchase" },
];

const bottomNavItems = [
  { id: "home", label: "Home", icon: Home, path: "/user/home" },
  { id: "chats", label: "Chats", icon: MessageCircle, path: "/user/chats" },
  { id: "forum", label: "Forum", icon: Users, path: "/user/forum" },
];

export function UserLayout({ children }: UserLayoutProps) {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isActiveTop = (path: string) => location === path;
  const isActiveBottom = (path: string) => location === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Section: Profile + Top Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          {/* Profile Section */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {user?.name || "User"}
              </h2>
              <div className="flex gap-4 mt-1 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="text-lg">☉</span> SUN
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-lg">☽</span> MOO
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-lg">↑</span> ASC
                </span>
              </div>
            </div>
          </div>

          {/* Top Navigation Tabs */}
          <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {topNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActiveTop(item.path);
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation(item.path)}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap transition-colors",
                    active
                      ? "text-primary border-b-2 border-primary rounded-none"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0 z-50">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex justify-around items-center">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActiveBottom(item.path);
              return (
                <button
                  key={item.id}
                  onClick={() => setLocation(item.path)}
                  className={cn(
                    "flex flex-col items-center gap-1 transition-colors py-2 px-4 rounded-lg",
                    active
                      ? "text-primary"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn("h-6 w-6", active && "fill-current")} />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
