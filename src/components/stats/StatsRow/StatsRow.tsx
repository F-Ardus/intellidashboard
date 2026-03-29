import type { Severity } from '../../../types/indicator';
import type { Stats } from '../../../types/stats';
import { StatCard } from '../StatCard/StatCard';
import { useT } from '../../../contexts/LocaleContext';
import styles from './StatsRow.module.scss';

interface StatsRowProps {
  stats: Stats | null;
  loading: boolean;
  onViewStats?: () => void;
  onFilterBySeverity?: (severity: Severity) => void;
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function StatsRow({ stats, loading, onViewStats, onFilterBySeverity }: StatsRowProps) {
  const { t } = useT();
  const val = (n: number | undefined) =>
    loading || stats === null ? null : (n ?? 0);

  const ready = stats !== null && !loading;

  return (
    <div className={styles.row}>
      <StatCard
        label={t.stats.total}
        value={val(stats?.total)}
        variant="total"
        subLabel={t.stats.totalSub}
        icon={<ShieldIcon />}
        onClick={ready && onViewStats ? onViewStats : undefined}
      />
      <StatCard
        label={t.stats.critical}
        value={val(stats?.critical)}
        variant="critical"
        subLabel={t.stats.criticalSub}
        onClick={ready && onFilterBySeverity ? () => onFilterBySeverity('critical') : undefined}
      />
      <StatCard
        label={t.stats.high}
        value={val(stats?.high)}
        variant="high"
        subLabel={t.stats.highSub}
        onClick={ready && onFilterBySeverity ? () => onFilterBySeverity('high') : undefined}
      />
      <StatCard
        label={t.stats.medium}
        value={val(stats?.medium)}
        variant="medium"
        subLabel={t.stats.mediumSub}
        onClick={ready && onFilterBySeverity ? () => onFilterBySeverity('medium') : undefined}
      />
      <StatCard
        label={t.stats.low}
        value={val(stats?.low)}
        variant="low"
        subLabel={t.stats.lowSub}
        onClick={ready && onFilterBySeverity ? () => onFilterBySeverity('low') : undefined}
      />
    </div>
  );
}
