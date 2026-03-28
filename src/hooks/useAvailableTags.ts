import { useEffect, useState } from 'react';
import { fetchAvailableTags } from '../api/tags';
import type { UIFilters } from './useFilters';

// Full static list — used as the initial value before the first fetch
const ALL_TAGS = [
  'backdoor', 'botnet', 'brute-force', 'c2', 'credential', 'cryptominer',
  'ddos', 'dga', 'drive-by', 'dropper', 'exploit', 'exploit-kit',
  'fast-flux', 'infostealer', 'malware', 'mining', 'parking', 'payload',
  'phishing', 'proxy', 'ransomware', 'rat', 'redirect', 'rootkit',
  'scanner', 'scam', 'sinkhole', 'smtp-spam', 'ssh-attack', 'tor-exit',
  'trojan', 'typosquat', 'vpn', 'watering-hole', 'worm',
];

export { ALL_TAGS };

export function useAvailableTags(filters: UIFilters): string[] {
  const [availableTags, setAvailableTags] = useState<string[]>(ALL_TAGS);

  const { search, severity, type, source, tags } = filters;
  // Serialise tags array to a stable string for the dependency comparison
  const tagsKey = tags ? tags.join(',') : '';

  useEffect(() => {
    const controller = new AbortController();

    fetchAvailableTags(
      { search, severity, type, source, tags },
      controller.signal,
    )
      .then((res) => setAvailableTags(res.tags))
      .catch(() => {
        // On error keep the current list — don't flash to empty
      });

    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, severity, type, source, tagsKey]);

  return availableTags;
}
