import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { PageHeader } from './components/header/PageHeader';
import { Sidebar } from './components/layout/Sidebar';
import { StatsRow } from './components/stats/StatsRow';
import { IndicatorTable } from './components/table/IndicatorTable';
import { Toolbar } from './components/toolbar/Toolbar';
import { useFilters } from './hooks/useFilters';
import { useIndicators } from './hooks/useIndicators';
import { useStats } from './hooks/useStats';

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { stats, loading: statsLoading } = useStats();
  const { filters, setSearch, setSeverity, setType, setSource, reset } = useFilters();
  const { data: indicators, loading: indicatorsLoading } = useIndicators(filters);

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
      {/* Pagination + detail panel — added in subsequent commits */}
    </AppLayout>
  );
}

export default App;
