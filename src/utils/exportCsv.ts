import type { Indicator } from '../types/indicator';
import { formatAbsoluteTime } from './time';

const HEADERS = ['Value', 'Type', 'Severity', 'Source', 'Confidence', 'First Seen', 'Last Seen', 'Tags'];

function escapeCell(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function indicatorToRow(indicator: Indicator): string {
  return [
    indicator.value,
    indicator.type,
    indicator.severity,
    indicator.source,
    `${indicator.confidence}%`,
    formatAbsoluteTime(indicator.firstSeen),
    formatAbsoluteTime(indicator.lastSeen),
    indicator.tags.join('; '),
  ]
    .map(escapeCell)
    .join(',');
}

export function exportToCsv(indicators: Indicator[], filename: string): void {
  const rows = [HEADERS.join(','), ...indicators.map(indicatorToRow)];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
