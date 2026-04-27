'use client';

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia(query);

    const updateMatches = () => {
      setMatches(media.matches);
    };

    updateMatches();

    media.addEventListener('change', updateMatches);

    return () => {
      media.removeEventListener('change', updateMatches);
    };
  }, [query]);

  return matches;
}
