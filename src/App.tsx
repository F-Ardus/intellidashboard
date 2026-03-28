import { useCallback, useState } from 'react';
import { DetailPanel } from './components/detail/DetailPanel';
import { PageHeader } from './components/header/PageHeader';
import { AppLayout } from './components/layout/AppLayout';
import { Sidebar } from './components/layout/Sidebar';
import { Pagination } from './components/pagination/Pagination';
import { StatsRow } from './components/stats/StatsRow';
import { IndicatorTable } from './components/table/IndicatorTable';
import { Toolbar } from './components/toolbar/Toolbar';
import { useFilters } from './hooks/useFilters';
import { useIndicators } from './hooks/useIndicators';
import { useStats } from './hooks/useStats';
import styles from './App.module.scss';

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const { stats, loading: statsLoading } = useStats();
  const { filters, setSearch, setSeverity, setType, setSource, setPage, reset } = useFilters();
  const { data: indicators, loading: indicatorsLoading, total, totalPages } = useIndicators(filters);

  const hasActiveFilters = Boolean(
    filters.search || filters.severity || filters.type || filters.source,
  );

  const handleToggleCheck = useCallback((id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    setCheckedIds((prev) => {
      const allIds = indicators.map((i) => i.id);
      const allChecked = allIds.every((id) => prev.has(id));
      if (allChecked) {
        const next = new Set(prev);
        allIds.forEach((id) => next.delete(id));
        return next;
      }
      return new Set([...prev, ...allIds]);
    });
  }, [indicators]);

  return (
    <AppLayout sidebar={<Sidebar />}>
      <PageHeader />
      <StatsRow stats={stats} loading={statsLoading} />
      <Toolbar
        search={filters.search ?? ''}
        severity={filters.severity}
        type={filters.type}
        source={filters.source}
        onSearchChange={setSearch}
        onSeverityChange={setSeverity}
        onTypeChange={setType}
        onSourceChange={setSource}
        onClear={reset}
        hasActiveFilters={hasActiveFilters}
      />
      <div className={styles.contentRow}>
        <div className={styles.tableArea}>
          <IndicatorTable
            indicators={indicators}
            loading={indicatorsLoading}
            selectedId={selectedId}
            onSelect={setSelectedId}
            hasFilters={hasActiveFilters}
            checkedIds={checkedIds}
            onToggleCheck={handleToggleCheck}
            onToggleAll={handleToggleAll}
          />
          <Pagination
            page={filters.page ?? 1}
            totalPages={totalPages}
            total={total}
            limit={filters.limit ?? 20}
            onPageChange={setPage}
          />
        </div>
        {selectedId && (
          <DetailPanel id={selectedId} onClose={() => setSelectedId(null)} />
        )}
      </div>
    </AppLayout>
  );
}

export default App;
