import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { PageHeader } from './components/header/PageHeader';
import { Sidebar } from './components/layout/Sidebar';
import { Pagination } from './components/pagination/Pagination';
import { StatsRow } from './components/stats/StatsRow';
import { IndicatorTable } from './components/table/IndicatorTable';
import { Toolbar } from './components/toolbar/Toolbar';
import { useFilters } from './hooks/useFilters';
import { useIndicators } from './hooks/useIndicators';
import { useStats } from './hooks/useStats';

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { stats, loading: statsLoading } = useStats();
  const { filters, setSearch, setSeverity, setType, setSource, setPage, reset } = useFilters();
  const { data: indicators, loading: indicatorsLoading, total, totalPages } = useIndicators(filters);

  const hasActiveFilters = Boolean(
    filters.search || filters.severity || filters.type || filters.source,
  );

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
      <IndicatorTable
        indicators={indicators}
        loading={indicatorsLoading}
        selectedId={selectedId}
        onSelect={setSelectedId}
        hasFilters={hasActiveFilters}
      />
      <Pagination
        page={filters.page ?? 1}
        totalPages={totalPages}
        total={total}
        limit={filters.limit ?? 20}
        onPageChange={setPage}
      />
      {/* Detail panel — added in next commit */}
    </AppLayout>
  );
}

export default App;
