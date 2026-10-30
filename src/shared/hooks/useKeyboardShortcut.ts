import { useEffect } from 'react';

export function useKeyboardShortcut(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options: { ctrlOrMeta?: boolean; enabled?: boolean } = {}
): void {
  const { ctrlOrMeta = false, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const matchesKey = event.key.toLowerCase() === key.toLowerCase();
      const matchesModifier = ctrlOrMeta ? event.metaKey || event.ctrlKey : true;

      if (matchesKey && matchesModifier) {
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback, ctrlOrMeta, enabled]);
}
