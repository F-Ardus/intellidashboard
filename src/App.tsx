import { AppLayout } from './components/layout/AppLayout';
import { Sidebar } from './components/layout/Sidebar';

function App() {
  return (
    <AppLayout sidebar={<Sidebar />}>
      {/* Dashboard content — built up in subsequent commits */}
    </AppLayout>
  );
}

export default App;
