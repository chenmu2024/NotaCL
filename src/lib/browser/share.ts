export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'failed';

export async function shareOrCopy(title: string, url: string): Promise<ShareResult> {
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, url });
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
    }
  }

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return 'copied';
    }

  } catch {}

  // Keep the manual-copy fallback useful when sharing/clipboard permissions are unavailable.
  if (typeof window !== 'undefined') window.history.replaceState(null, '', url);
  return 'failed';
}
