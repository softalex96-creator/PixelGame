import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import CartDrawer from "@/components/CartDrawer";
import StorefrontNav from "@/components/StorefrontNav";
import { LocalCartProvider } from "@/contexts/LocalCartContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useLanguage } from "@/contexts/LanguageContext";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  const { t } = useLanguage();
  return (
    <div className="app-shell">
      <StorefrontNav />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/product/:slug" component={ProductDetail} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
      <footer className="site-footer"><div className="container"><span>© 2026 PixelShelf</span><span>{t.footer}</span></div></footer>
      <CartDrawer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <LanguageProvider>
            <LocalCartProvider>
              <Toaster />
              <Router />
            </LocalCartProvider>
          </LanguageProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
