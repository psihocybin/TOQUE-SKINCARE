export const FAVORITES_STORAGE_KEY = "tutorials_favorites";

export function readFavorites(): Set<string> {
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export function writeFavorites(favorites: Set<string>): void {
  try {
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(Array.from(favorites)),
    );
  } catch {
    // localStorage может быть недоступен (privacy mode) — тихо игнорируем.
  }
}
