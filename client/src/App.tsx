import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import CartDrawer from "@/components/CartDrawer";
import StorefrontNav from "@/components/StorefrontNav";
import { LocalCartProvider } from "@/contexts/LocalCartContext";
import { FavouritesProvider } from "@/contexts/FavouritesContext";
import { OrdersProvider } from "@/contexts/OrdersContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useLanguage } from "@/contexts/LanguageContext";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import Account from "@/pages/Account";
import { Route, Router, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function StorefrontRoutes() {
  const { t } = useLanguage();
  return (
    <div className="app-shell">
      <StorefrontNav />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/product/:slug" component={ProductDetail} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/account" component={Account} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
      <footer className="site-footer"><div className="container"><span>© 2026 PixelGame</span><span>{t.footer}</span></div></footer>
      <CartDrawer />
    </div>
  );
}

function AppContent() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <LanguageProvider>
            <FavouritesProvider>
              <OrdersProvider>
                <LocalCartProvider>
                  <Toaster />
                <StorefrontRoutes />
                </LocalCartProvider>
              </OrdersProvider>
            </FavouritesProvider>
          </LanguageProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function App() {
  return import.meta.env.VITE_DEPLOY_TARGET === "github-pages"
    ? <Router hook={useHashLocation}><AppContent /></Router>
    : <AppContent />;
}

export default App;
