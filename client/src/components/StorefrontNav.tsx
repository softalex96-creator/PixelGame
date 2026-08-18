import { useLocalCart } from "@/contexts/LocalCartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFavourites } from "@/contexts/FavouritesContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import { applyHomeSectionState, HomeSectionLink, queuePendingHomeSectionState } from "@/components/HomeSectionLink";
import { Heart, Moon, ShoppingBag, Sparkles, Sun, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function StorefrontNav() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const { itemCount, openCart } = useLocalCart();
  const { favouriteCount } = useFavourites();
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  function handleSearch() {
    const state = { query: search };
    const section = document.getElementById("catalog");
    if (section) {
      applyHomeSectionState(state);
      section.scrollIntoView({ behavior: "smooth" });
      return;
    }
    queuePendingHomeSectionState(state);
    navigate("/");
    window.setTimeout(() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }), 90);
  }

  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Link href="/" className="brand" aria-label="PixelGame home">
          <span className="brand-mark"><Sparkles size={16} strokeWidth={2.6} /></span>
          <span>PixelGame</span>
        </Link>

        <nav className="desktop-nav" aria-label="Marketplace navigation">
          <HomeSectionLink sectionId="catalog">{t.games}</HomeSectionLink>
          <HomeSectionLink sectionId="catalog">{t.currencyPacks}</HomeSectionLink>
          <HomeSectionLink sectionId="how-it-works">{t.howItWorks}</HomeSectionLink>
        </nav>

        <SearchAutocomplete
          compact
          value={search}
          onChange={setSearch}
          onSubmit={handleSearch}
          onSelect={(suggestion) => navigate(`/product/${suggestion.productSlug}`)}
          placeholder={t.searchCurrencyPacks}
          ariaLabel={t.searchCurrencyPacks}
        />

        <div className="language-switch" aria-label="Language selector">
          <button className={locale === "en" ? "is-active" : ""} onClick={() => setLocale("en")} aria-pressed={locale === "en"}>EN</button>
          <button className={locale === "ru" ? "is-active" : ""} onClick={() => setLocale("ru")} aria-pressed={locale === "ru"}>РУ</button>
        </div>

        <div className="currency-switch" aria-label={t.currencyLabel}>
          {(["USD", "EUR", "RUB"] as const).map((option) => <button key={option} className={currency === option ? "is-active" : ""} onClick={() => setCurrency(option)} aria-pressed={currency === option}>{option}</button>)}
        </div>

        <button className="theme-toggle" onClick={toggleTheme} aria-label={theme === "dark" ? t.themeLight : t.themeDark} title={theme === "dark" ? t.themeLight : t.themeDark} aria-pressed={theme === "dark"}>
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          <span className="theme-label">{theme === "dark" ? t.themeLight : t.themeDark}</span>
        </button>

        <HomeSectionLink sectionId="catalog" pendingState={{ showSaved: true }} className="favourites-trigger" aria-label={`${t.savedBundles}: ${favouriteCount}`}>
          <Heart size={18} fill={favouriteCount > 0 ? "currentColor" : "none"} />
          {favouriteCount > 0 && <span className="favourites-count">{favouriteCount}</span>}
        </HomeSectionLink>

        <Link href="/account" className="account-trigger" aria-label={t.account}>
          <UserRound size={18} /><span>{t.account}</span>
        </Link>

        <button className="cart-trigger" onClick={openCart} aria-label={`${t.cart}: ${itemCount}`}>
          <ShoppingBag size={19} />
          <span className="cart-label">{t.cart}</span>
          {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
        </button>
      </div>
    </header>
  );
}
