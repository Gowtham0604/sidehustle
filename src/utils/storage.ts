/**
 * localStorage utility — all persistence for favorites, recents, saved results, comparisons.
 * Always fails gracefully (private browsing, storage quota, etc.)
 */

import type { SavedResult, RecentlyViewed, SavedComparison } from "../types/side-hustle";

const KEYS = {
  FAVORITES: "shj_favorites",
  RECENTS: "shj_recents",
  SAVED_RESULTS: "shj_saved_results",
  SAVED_COMPARISONS: "shj_saved_comparisons",
} as const;

const MAX_RECENTS = 20;
const MAX_FAVORITES = 50;
const MAX_SAVED = 20;
const MAX_COMPARISONS = 10;

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or private browsing
  }
}

// ─── Favorites ───────────────────────────────────────────────────────────────
export function getFavorites(): string[] {
  return safeGet<string[]>(KEYS.FAVORITES, []);
}

export function toggleFavorite(slug: string): boolean {
  const favs = getFavorites();
  const idx = favs.indexOf(slug);
  if (idx === -1) {
    const updated = [slug, ...favs].slice(0, MAX_FAVORITES);
    safeSet(KEYS.FAVORITES, updated);
    return true; // added
  } else {
    favs.splice(idx, 1);
    safeSet(KEYS.FAVORITES, favs);
    return false; // removed
  }
}

export function isFavorited(slug: string): boolean {
  return getFavorites().includes(slug);
}

// ─── Recently Viewed ─────────────────────────────────────────────────────────
export function getRecents(): RecentlyViewed[] {
  return safeGet<RecentlyViewed[]>(KEYS.RECENTS, []);
}

export function addRecentlyViewed(slug: string, name: string, category: string): void {
  const recents = getRecents().filter((r) => r.slug !== slug);
  const updated: RecentlyViewed[] = [
    { slug, name, category, viewedAt: Date.now() },
    ...recents,
  ].slice(0, MAX_RECENTS);
  safeSet(KEYS.RECENTS, updated);
}

// ─── Saved Results ────────────────────────────────────────────────────────────
export function getSavedResults(): SavedResult[] {
  return safeGet<SavedResult[]>(KEYS.SAVED_RESULTS, []);
}

export function saveResult(slug: string, name: string, matchPercent: number): void {
  const existing = getSavedResults().filter((r) => r.slug !== slug);
  const updated: SavedResult[] = [
    { slug, name, matchPercent, savedAt: Date.now() },
    ...existing,
  ].slice(0, MAX_SAVED);
  safeSet(KEYS.SAVED_RESULTS, updated);
}

export function removeSavedResult(slug: string): void {
  const updated = getSavedResults().filter((r) => r.slug !== slug);
  safeSet(KEYS.SAVED_RESULTS, updated);
}

export function isSavedResult(slug: string): boolean {
  return getSavedResults().some((r) => r.slug === slug);
}

// ─── Saved Comparisons ───────────────────────────────────────────────────────
export function getSavedComparisons(): SavedComparison[] {
  return safeGet<SavedComparison[]>(KEYS.SAVED_COMPARISONS, []);
}

export function saveComparison(slugA: string, nameA: string, slugB: string, nameB: string): void {
  const key = [slugA, slugB].sort().join("--");
  const existing = getSavedComparisons().filter(
    (c) => [c.slugA, c.slugB].sort().join("--") !== key
  );
  const updated: SavedComparison[] = [
    { slugA, nameA, slugB, nameB, savedAt: Date.now() },
    ...existing,
  ].slice(0, MAX_COMPARISONS);
  safeSet(KEYS.SAVED_COMPARISONS, updated);
}

// ─── Share URL helpers ────────────────────────────────────────────────────────
export function buildShareUrl(params: Record<string, string>): string {
  const qs = new URLSearchParams(params).toString();
  const base =
    typeof window !== "undefined"
      ? `${window.location.origin}/results`
      : "https://sidehustlesjob.com/results";
  return `${base}?${qs}`;
}
