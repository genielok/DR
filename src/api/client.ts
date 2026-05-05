/**
 * API client utilities.
 *
 * BASE_URL points to your real backend when you're ready.
 * Right now all functions use mock data, so this is unused —
 * but it's wired up so swapping is a one-line change.
 */
export const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

/**
 * Simulates a network round-trip so the app behaves like it
 * already talks to a real API (loading states, async patterns, etc.).
 * Delete this helper once real fetch calls are in place.
 */
export function mockDelay<T>(data: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}
