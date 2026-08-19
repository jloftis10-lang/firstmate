/**
 * THE URL AS THE APPLICATION STATE, for the Booking Check.
 *
 * The check used to hold its result in a `useState` that no URL
 * described. That made a run un-bookmarkable, un-sendable and invisible
 * to the back button: an advisor who ran a check, clicked through to the
 * ship page and pressed back landed on an empty form and had to answer
 * five questions again. The five params already exist and are already a
 * frozen public contract — `/share` has used them since the beginning —
 * so the fix is to let `/check` read the same ones.
 *
 * WHY NOT `useSearchParams`. It forces the subtree under a Suspense
 * boundary and drops it out of the prerender, so the form and its
 * heading would be absent from the static HTML of the tool the whole
 * product is for. `useSyncExternalStore` is the hook for exactly this:
 * `getServerSnapshot` returns the empty string so the prerender and the
 * hydration agree, and the client snapshot supplies the query on the
 * pass after.
 *
 * WHY A MODULE-LEVEL STORE rather than reading `location` directly:
 * `history.pushState` does NOT fire `popstate`. A component that pushed
 * a URL would not hear about its own navigation. So pushes go through
 * `pushUrl`, which notifies the subscribers the same way a back button
 * does — and back, forward and a fresh link all travel the same path
 * through the component as a result.
 */

const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

export function subscribeToUrl(callback: () => void): () => void {
  if (listeners.size === 0) window.addEventListener("popstate", notify);
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0) window.removeEventListener("popstate", notify);
  };
}

/** Stable string, so React's identity check does the right thing. */
export function currentSearch(): string {
  return window.location.search;
}

/**
 * What the server rendered. Always the empty query, which is why the
 * prerendered HTML of `/check` is the form — the right thing for a
 * crawler and for anyone arriving without a link.
 */
export function serverSearch(): string {
  return "";
}

/** Navigate within the page and tell the subscribers. */
export function pushUrl(url: string): void {
  window.history.pushState(null, "", url);
  notify();
}
