// Prefetch helpers — warm the catalog cache and decode images ahead of paint
// so pages render fully-formed (no pop-in) once skeletons clear.
import {
  getActiveProducts,
  getActiveCategories,
  getApprovedReviews,
} from './catalog';

let catalogStarted = false;

/**
 * Fire the Home/Menu catalog reads. Results are memoized inside catalog.js,
 * so the page components reuse these in-flight promises instead of refetching.
 * Safe to call multiple times — only the first call does work.
 */
export function prefetchCatalog() {
  if (catalogStarted) return;
  catalogStarted = true;
  // Fire and forget; failures are swallowed by the catalog getters.
  getActiveProducts();
  getActiveCategories();
  getApprovedReviews();
}

/**
 * Resolve once every image URL has loaded (or errored). Used to hold skeletons
 * until imagery is actually decoded, giving a smooth, complete reveal.
 * A safety timeout prevents a slow/broken asset from blocking forever.
 */
export function preloadImages(urls, timeout = 4000) {
  const list = Array.from(new Set((urls || []).filter(Boolean)));
  if (list.length === 0) return Promise.resolve();

  const loaders = list.map(
    (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      })
  );

  const guard = new Promise((resolve) => setTimeout(resolve, timeout));
  return Promise.race([Promise.all(loaders), guard]);
}
