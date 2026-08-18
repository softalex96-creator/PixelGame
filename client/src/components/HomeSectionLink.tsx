import { type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { useLocation } from "wouter";

const pendingHomeSectionStateKey = "pixelgame:pending-home-section";
export const homeSectionStateEvent = "pixelgame:home-section-state";

export type PendingHomeSectionState = {
  query?: string;
  showSaved?: boolean;
};

export function parsePendingHomeSectionState(value: string | null): PendingHomeSectionState | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") return null;
    const record = parsed as Record<string, unknown>;
    const query = typeof record.query === "string" && record.query.trim() ? record.query : undefined;
    const showSaved = record.showSaved === true ? true : undefined;
    return query || showSaved ? { query, showSaved } : null;
  } catch {
    return null;
  }
}

export function consumePendingHomeSectionState(): PendingHomeSectionState | null {
  if (typeof window === "undefined") return null;
  const state = parsePendingHomeSectionState(window.sessionStorage.getItem(pendingHomeSectionStateKey));
  window.sessionStorage.removeItem(pendingHomeSectionStateKey);
  return state;
}

export function applyHomeSectionState(state: PendingHomeSectionState) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<PendingHomeSectionState>(homeSectionStateEvent, { detail: state }));
}

export function queuePendingHomeSectionState(state: PendingHomeSectionState) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(pendingHomeSectionStateKey, JSON.stringify(state));
}

type HomeSectionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
  children: ReactNode;
  sectionId: string;
  pendingState?: PendingHomeSectionState;
};

export function HomeSectionLink({ children, pendingState, sectionId, ...props }: HomeSectionLinkProps) {
  const [, navigate] = useLocation();

  function scrollToSection() {
    const section = document.getElementById(sectionId);
    if (!section) return false;
    section.scrollIntoView({ behavior: "smooth" });
    return true;
  }

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (pendingState) applyHomeSectionState(pendingState);
    if (scrollToSection()) return;
    if (pendingState) queuePendingHomeSectionState(pendingState);
    navigate("/");
    window.setTimeout(scrollToSection, 90);
  }

  return <a {...props} href="/" onClick={handleClick}>{children}</a>;
}
