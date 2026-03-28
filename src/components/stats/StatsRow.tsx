import type { Stats } from '../../types/stats';
import { StatCard } from './StatCard';
import styles from './StatsRow.module.scss';

interface StatsRowProps {
  stats: Stats | null;
  loading: boolean;
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function StatsRow({ stats, loading }: StatsRowProps) {
  const val = (n: number | undefined) =>
    loading || stats === null ? null : (n ?? 0);

  return (
    <div className={styles.row}>
      <StatCard
        label="Total Indicators"
        value={val(stats?.total)}
        variant="total"
        subLabel="↑ 12% from last week"
        icon={<ShieldIcon />}
      />
      <StatCard
        label="Critical"
        value={val(stats?.critical)}
        variant="critical"
        subLabel="Requires immediate action"
      />
      <StatCard
        label="High"
        value={val(stats?.high)}
        variant="high"
        subLabel="Active monitoring"
      />
      <StatCard
        label="Medium"
        value={val(stats?.medium)}
        variant="medium"
        subLabel="Under review"
      />
      <StatCard
        label="Low"
        value={val(stats?.low)}
        variant="low"
        subLabel="Informational"
      />
    </div>
  );
}
