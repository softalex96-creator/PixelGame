import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { type DisplayCurrency } from "@/lib/pixelshelf-data";

const STORAGE_KEY = "pixelgame:display-currency";
const supportedCurrencies: DisplayCurrency[] = ["USD", "EUR", "RUB"];

type CurrencyContextValue = {
  currency: DisplayCurrency;
  setCurrency: (currency: DisplayCurrency) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function readInitialCurrency(): DisplayCurrency {
  if (typeof window === "undefined") return "USD";
  const queryCurrency = new URLSearchParams(window.location.search).get("currency")?.toUpperCase();
  if (supportedCurrencies.includes(queryCurrency as DisplayCurrency)) return queryCurrency as DisplayCurrency;
  const storedCurrency = window.localStorage.getItem(STORAGE_KEY);
  return supportedCurrencies.includes(storedCurrency as DisplayCurrency) ? storedCurrency as DisplayCurrency : "USD";
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<DisplayCurrency>(readInitialCurrency);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, currency);
  }, [currency]);

  const value = useMemo(() => ({ currency, setCurrency }), [currency]);
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
