import { getSearchSuggestions, type SearchSuggestion } from "@/lib/pixelshelf-data";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";

type SearchAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  onSelect: (suggestion: SearchSuggestion) => void;
  onSubmit?: () => void;
  placeholder: string;
  ariaLabel: string;
  compact?: boolean;
  submitLabel?: string;
};

export default function SearchAutocomplete({ value, onChange, onSelect, onSubmit, placeholder, ariaLabel, compact = false, submitLabel }: SearchAutocompleteProps) {
  const { t } = useLanguage();
  const suggestions = useMemo(() => getSearchSuggestions(value), [value]);
  const [open, setOpen] = useState(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("suggestions") === "open");
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function choose(suggestion: SearchSuggestion) {
    onSelect(suggestion);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (open && activeIndex >= 0 && suggestions[activeIndex]) choose(suggestions[activeIndex]);
      else onSubmit?.();
    }
  }

  const suggestionLabel = (type: SearchSuggestion["type"]) => type === "bundle" ? t.suggestionBundle : type === "game" ? t.suggestionGame : t.suggestionCurrency;

  return (
    <div className={`search-autocomplete ${compact ? "is-compact" : ""}`} ref={rootRef}>
      <Search size={compact ? 16 : 20} aria-hidden="true" />
      <input
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={open && suggestions.length > 0}
        aria-controls={listboxId}
        aria-autocomplete="list"
        value={value}
        onChange={(event) => { onChange(event.target.value); setOpen(true); setActiveIndex(-1); }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {submitLabel && <button type="button" onClick={onSubmit}>{submitLabel}</button>}
      {open && value.trim() && (
        <div className="suggestion-panel" id={listboxId} role="listbox" aria-label={t.searchSuggestions}>
          {suggestions.length > 0 ? suggestions.map((suggestion, index) => (
            <button key={suggestion.id} className={index === activeIndex ? "is-active" : ""} role="option" aria-selected={index === activeIndex} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(suggestion)}>
              <span><strong>{suggestion.label}</strong><small>{suggestion.detail}</small></span>
              <em>{suggestionLabel(suggestion.type)}</em>
            </button>
          )) : <p className="suggestion-empty">{t.noSuggestions}</p>}
        </div>
      )}
    </div>
  );
}
