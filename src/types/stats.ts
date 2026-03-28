export interface Stats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  byType: {
    ip: number;
    domain: number;
    hash: number;
    url: number;
  };
}
