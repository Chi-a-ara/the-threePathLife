import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import MatrixResult from "./pages/MatrixResult";
import PaymentSuccess from "./pages/PaymentSuccess";
import AdminPanel from "./pages/AdminPanel";
import Personal from "./pages/user/Personal";
import DayForecast from "./pages/user/DayForecast";
import Numbers from "./pages/user/Numbers";
import Aspects from "./pages/user/Aspects";
import HistoryCalculator from "./pages/user/HistoryCalculator";
import Training from "./pages/user/Training";
import Purchase from "./pages/user/Purchase";
import UserHome from "./pages/user/UserHome";
import Chats from "./pages/user/Chats";
import Forum from "./pages/user/Forum";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/matrix/:id" component={MatrixResult} />
      <Route path="/payment/success" component={PaymentSuccess} />
      <Route path="/admin" component={AdminPanel} />
      {/* User Area Routes */}
      <Route path="/user/personal" component={Personal} />
      <Route path="/user/forecast" component={DayForecast} />
      <Route path="/user/numbers" component={Numbers} />
      <Route path="/user/aspects" component={Aspects} />
      <Route path="/user/calculator" component={HistoryCalculator} />
      <Route path="/user/training" component={Training} />
      <Route path="/user/purchase" component={Purchase} />
      <Route path="/user/home" component={UserHome} />
      <Route path="/user/chats" component={Chats} />
      <Route path="/user/forum" component={Forum} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
