import { AppLayout } from './components/layout/AppLayout';
import { PageHeader } from './components/header/PageHeader';
import { Sidebar } from './components/layout/Sidebar';
import { StatsRow } from './components/stats/StatsRow';
import { useStats } from './hooks/useStats';

function App() {
  const { stats, loading } = useStats();

  return (
    <AppLayout sidebar={<Sidebar />}>
      <PageHeader />
      <StatsRow stats={stats} loading={loading} />
      {/* Table + detail panel — built up in subsequent commits */}
    </AppLayout>
  );
}

export default App;
