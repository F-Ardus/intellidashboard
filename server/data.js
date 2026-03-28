/**
 * Mock data generator for threat intelligence indicators.
 * Produces realistic-looking data so the dashboard feels authentic.
 */

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysBack) {
  const now = Date.now();
  const past = now - daysBack * 24 * 60 * 60 * 1000;
  return new Date(past + Math.random() * (now - past)).toISOString();
}

function randomIP() {
  const maliciousRanges = [
    () => `185.220.${randomInt(100, 103)}.${randomInt(1, 254)}`,
    () => `45.${randomInt(130, 155)}.${randomInt(1, 254)}.${randomInt(1, 254)}`,
    () => `91.${randomInt(200, 245)}.${randomInt(1, 254)}.${randomInt(1, 254)}`,
    () => `23.${randomInt(80, 130)}.${randomInt(1, 254)}.${randomInt(1, 254)}`,
    () => `103.${randomInt(10, 250)}.${randomInt(1, 254)}.${randomInt(1, 254)}`,
    () => `194.${randomInt(26, 165)}.${randomInt(1, 254)}.${randomInt(1, 254)}`,
    () => `77.${randomInt(70, 250)}.${randomInt(1, 254)}.${randomInt(1, 254)}`,
    () => `162.${randomInt(210, 250)}.${randomInt(1, 254)}.${randomInt(1, 254)}`,
  ];
  return randomItem(maliciousRanges)();
}

function randomDomain() {
  const prefixes = ['malware-c2', 'phish-login', 'drop-server', 'exfil-data', 'redir', 'cdn-fake', 'update-check', 'dl-payload', 'track-pixel', 'auth-spoof'];
  const mids = ['evil', 'dark', 'shadow', 'storm', 'ghost', 'phantom', 'stealth', 'black', 'crypto', 'zero'];
  const tlds = ['.net', '.ru', '.cn', '.top', '.xyz', '.cc', '.info', '.biz', '.io', '.tk'];
  return `${randomItem(prefixes)}.${randomItem(mids)}-${randomInt(1, 999)}${randomItem(tlds)}`;
}

function randomHash() {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

function randomURL() {
  const paths = ['/login', '/account/verify', '/secure/update', '/auth/confirm', '/download/invoice', '/reset-password', '/document/view', '/payment/process'];
  return `https://${randomDomain()}${randomItem(paths)}?id=${randomInt(10000, 99999)}`;
}

const sources = [
  'AbuseIPDB', 'OTX AlienVault', 'VirusTotal', 'Emerging Threats', 'MalwareBazaar',
  'PhishTank', 'Spamhaus', 'ThreatFox', 'URLhaus', 'CIRCL', 'Shodan',
  'GreyNoise', 'BinaryEdge', 'Censys', 'Silent Push', 'DomainTools'
];

const tagsByType = {
  ip: ['tor-exit', 'scanner', 'brute-force', 'proxy', 'botnet', 'vpn', 'mining', 'ddos', 'ssh-attack', 'smtp-spam'],
  domain: ['c2', 'malware', 'phishing', 'dga', 'fast-flux', 'typosquat', 'sinkhole', 'parking', 'exploit-kit'],
  hash: ['ransomware', 'trojan', 'backdoor', 'dropper', 'worm', 'infostealer', 'rat', 'cryptominer', 'rootkit'],
  url: ['phishing', 'credential', 'drive-by', 'redirect', 'exploit', 'payload', 'watering-hole', 'scam'],
};

const severityWeights = [
  { severity: 'critical', weight: 0.12 },
  { severity: 'high', weight: 0.28 },
  { severity: 'medium', weight: 0.40 },
  { severity: 'low', weight: 0.20 },
];

function weightedSeverity() {
  const r = Math.random();
  let cumulative = 0;
  for (const { severity, weight } of severityWeights) {
    cumulative += weight;
    if (r <= cumulative) return severity;
  }
  return 'medium';
}

const typeWeights = [
  { type: 'ip', weight: 0.40 },
  { type: 'domain', weight: 0.25 },
  { type: 'hash', weight: 0.20 },
  { type: 'url', weight: 0.15 },
];

function weightedType() {
  const r = Math.random();
  let cumulative = 0;
  for (const { type, weight } of typeWeights) {
    cumulative += weight;
    if (r <= cumulative) return type;
  }
  return 'ip';
}

function generateValue(type) {
  switch (type) {
    case 'ip': return randomIP();
    case 'domain': return randomDomain();
    case 'hash': return randomHash();
    case 'url': return randomURL();
    default: return randomIP();
  }
}

function generateTags(type) {
  const pool = tagsByType[type];
  const count = randomInt(1, 3);
  const tags = new Set();
  for (let i = 0; i < count; i++) {
    tags.add(randomItem(pool));
  }
  return [...tags];
}

function confidenceForSeverity(severity) {
  switch (severity) {
    case 'critical': return randomInt(80, 99);
    case 'high': return randomInt(60, 90);
    case 'medium': return randomInt(40, 75);
    case 'low': return randomInt(15, 55);
    default: return randomInt(30, 70);
  }
}

export function generateIndicators(count = 500) {
  const indicators = [];

  for (let i = 0; i < count; i++) {
    const type = weightedType();
    const severity = weightedSeverity();
    const firstSeen = randomDate(90);
    const lastSeen = randomDate(7);

    indicators.push({
      id: uuid(),
      value: generateValue(type),
      type,
      severity,
      source: randomItem(sources),
      firstSeen: firstSeen > lastSeen ? lastSeen : firstSeen,
      lastSeen,
      tags: generateTags(type),
      confidence: confidenceForSeverity(severity),
    });
  }

  // Sort by lastSeen descending (most recent first)
  indicators.sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen));

  return indicators;
}
