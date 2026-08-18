import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "pixelshelf:favourites";

export function toggleFavouriteId(ids: string[], id: string) {
  return ids.includes(id) ? ids.filter((savedId) => savedId !== id) : [...ids, id];
}

export function readSavedFavourites(rawValue: string | null) {
  if (!rawValue) return [];
  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? Array.from(new Set(parsed.filter((value): value is string => typeof value === "string"))) : [];
  } catch {
    return [];
  }
}

type FavouritesContextValue = {
  favouriteIds: string[];
  favouriteCount: number;
  isFavourite: (id: string) => boolean;
  toggleFavourite: (id: string) => void;
};

const FavouritesContext = createContext<FavouritesContextValue | null>(null);

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [favouriteIds, setFavouriteIds] = useState<string[]>(() => typeof window === "undefined" ? [] : readSavedFavourites(window.localStorage.getItem(STORAGE_KEY)));

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favouriteIds));
  }, [favouriteIds]);

  const value = useMemo(() => ({
    favouriteIds,
    favouriteCount: favouriteIds.length,
    isFavourite: (id: string) => favouriteIds.includes(id),
    toggleFavourite: (id: string) => setFavouriteIds((current) => toggleFavouriteId(current, id)),
  }), [favouriteIds]);

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
}

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (!context) throw new Error("useFavourites must be used within FavouritesProvider");
  return context;
}
