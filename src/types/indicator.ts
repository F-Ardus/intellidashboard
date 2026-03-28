/**
 * Threat Indicator Types
 *
 * These types define the data model for the threat intelligence dashboard.
 * The mock API returns data matching these interfaces.
 */

export type IndicatorType = 'ip' | 'domain' | 'hash' | 'url';

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface Indicator {
  id: string;
  value: string;
  type: IndicatorType;
  severity: Severity;
  source: string;
  firstSeen: string; // ISO 8601
  lastSeen: string; // ISO 8601
  tags: string[];
  confidence: number; // 0–100
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IndicatorFilters {
  search?: string;
  severity?: Severity;
  type?: IndicatorType;
  page?: number;
  limit?: number;
}
