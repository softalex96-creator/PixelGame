import { useLocalCart } from "@/contexts/LocalCartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, ShoppingBag, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";

export default function StorefrontNav() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const { itemCount, openCart } = useLocalCart();
  const { locale, setLocale, t } = useLanguage();

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(`/?search=${encodeURIComponent(search)}#catalog`);
  }

  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Link href="/" className="brand" aria-label="PixelShelf home">
          <span className="brand-mark"><Sparkles size={16} strokeWidth={2.6} /></span>
          <span>PixelShelf</span>
        </Link>

        <nav className="desktop-nav" aria-label="Marketplace navigation">
          <Link href="/#catalog">{t.games}</Link>
          <Link href="/#catalog">{t.currencyPacks}</Link>
          <Link href="/#how-it-works">{t.howItWorks}</Link>
        </nav>

        <form className="nav-search" onSubmit={handleSearch}>
          <Search size={16} />
          <input
            aria-label="Search assets"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.searchCurrencyPacks}
          />
        </form>

        <div className="language-switch" aria-label="Language selector">
          <button className={locale === "en" ? "is-active" : ""} onClick={() => setLocale("en")} aria-pressed={locale === "en"}>EN</button>
          <button className={locale === "ru" ? "is-active" : ""} onClick={() => setLocale("ru")} aria-pressed={locale === "ru"}>РУ</button>
        </div>

        <button className="cart-trigger" onClick={openCart} aria-label={`${t.cart}: ${itemCount}`}>
          <ShoppingBag size={19} />
          <span className="cart-label">{t.cart}</span>
          {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
        </button>
      </div>
    </header>
  );
}
