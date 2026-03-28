import { AppLayout } from './components/layout/AppLayout';
import { PageHeader } from './components/header/PageHeader';
import { Sidebar } from './components/layout/Sidebar';
import { StatsRow } from './components/stats/StatsRow';
import { Toolbar } from './components/toolbar/Toolbar';
import { useFilters } from './hooks/useFilters';
import { useStats } from './hooks/useStats';

function App() {
  const { stats, loading: statsLoading } = useStats();
  const { filters, setSearch, setSeverity, setType, setSource, reset } = useFilters();

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
      {/* Table + detail panel — built up in subsequent commits */}
    </AppLayout>
  );
}

export default App;
