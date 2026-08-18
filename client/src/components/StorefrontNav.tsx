import { useLocalCart } from "@/contexts/LocalCartContext";
import { Search, ShoppingBag, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";

export default function StorefrontNav() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const { itemCount, openCart } = useLocalCart();

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
          <Link href="/#catalog">Games</Link>
          <Link href="/#catalog">Currency packs</Link>
          <Link href="/#how-it-works">How it works</Link>
        </nav>

        <form className="nav-search" onSubmit={handleSearch}>
          <Search size={16} />
          <input
            aria-label="Search assets"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search currency packs"
          />
        </form>

        <button className="cart-trigger" onClick={openCart} aria-label={`Open cart with ${itemCount} items`}>
          <ShoppingBag size={19} />
          <span className="cart-label">Cart</span>
          {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
        </button>
      </div>
    </header>
  );
}
