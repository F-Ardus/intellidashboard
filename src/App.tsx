import { AppLayout } from './components/layout/AppLayout';
import { PageHeader } from './components/header/PageHeader';
import { Sidebar } from './components/layout/Sidebar';

function App() {
  return (
    <AppLayout sidebar={<Sidebar />}>
      <PageHeader />
      {/* Dashboard content — built up in subsequent commits */}
    </AppLayout>
  );
}

export default App;
