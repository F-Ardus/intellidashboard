export const SOURCES = [
  'AbuseIPDB', 'OTX AlienVault', 'VirusTotal', 'Emerging Threats', 'MalwareBazaar',
  'PhishTank', 'Spamhaus', 'ThreatFox', 'URLhaus', 'CIRCL', 'Shodan',
  'GreyNoise', 'BinaryEdge', 'Censys', 'Silent Push', 'DomainTools',
] as const;

export const SOURCE_OPTIONS = SOURCES.map((s) => ({ value: s, label: s }));
