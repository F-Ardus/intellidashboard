import { useCallback, useMemo, useState } from 'react';
import { DetailPanel } from './components/detail/DetailPanel/DetailPanel';
import { PageHeader } from './components/header/PageHeader/PageHeader';
import { AddIndicatorModal } from './components/indicators/AddIndicatorModal/AddIndicatorModal';
import { StatsModal } from './components/stats/StatsModal/StatsModal';
import { Toast } from './components/common/Toast/Toast';
import { AppLayout } from './components/layout/AppLayout/AppLayout';
import { Sidebar } from './components/layout/Sidebar/Sidebar';
import type { AppView } from './components/layout/Sidebar/Sidebar';
import { SettingsView } from './components/settings/SettingsView/SettingsView';
import { useTheme } from './hooks/useTheme';
import { useLocale } from './hooks/useLocale';
import { fmt } from './i18n';
import { LocaleContext } from './contexts/LocaleContext';
import { Pagination } from './components/pagination/Pagination/Pagination';
import { StatsRow } from './components/stats/StatsRow/StatsRow';
import { IndicatorTable } from './components/table/IndicatorTable/IndicatorTable';
import { SelectionBar } from './components/toolbar/SelectionBar/SelectionBar';
import { Toolbar } from './components/toolbar/Toolbar/Toolbar';
import { useAutoRefresh } from './hooks/useAutoRefresh';
import { useAvailableTags } from './hooks/useAvailableTags';
import { useFilters } from './hooks/useFilters';
import { useIndicators } from './hooks/useIndicators';
import { sortIndicators, useSort } from './hooks/useSort';
import { useStats } from './hooks/useStats';
import type { Indicator } from './types/indicator';
import { exportToCsv } from './utils/exportCsv';
import { fetchIndicators } from './api/indicators';
import styles from './App.module.scss';

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checkedIndicators, setCheckedIndicators] = useState<Map<string, Indicator>>(new Map());
  const [allPagesSelected, setAllPagesSelected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [view, setView] = useState<AppView>('dashboard');
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, translations: t, intlLocale } = useLocale();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [localIndicators, setLocalIndicators] = useState<Indicator[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
    setLocalIndicators([]);
  }, []);
  const { secondsLeft } = useAutoRefresh(handleRefresh);

  const { stats, loading: statsLoading } = useStats(refreshKey);
  const { filters, setSearch, setSeverity, setType, setSource, setTags, setPage, setLimit, reset } = useFilters();
  const { data: indicators, loading: indicatorsLoading, total, totalPages } = useIndicators(filters, refreshKey);
  const { sort, toggleSort } = useSort();
  const sortedIndicators = useMemo(() => sortIndicators(indicators, sort), [indicators, sort]);
  const displayIndicators = useMemo(
    () => [...localIndicators, ...sortedIndicators],
    [localIndicators, sortedIndicators],
  );

  const handleAddIndicator = useCallback((indicator: Indicator) => {
    setLocalIndicators((prev) => [indicator, ...prev]);
    setToast(t.toast.indicatorAdded);
  }, [t]);
  const availableTags = useAvailableTags(filters);

  const hasActiveFilters = Boolean(
    filters.search || filters.severity || filters.type || filters.source || filters.tags?.length,
  );

  const checkedIds = new Set(checkedIndicators.keys());
  const allOnPageSelected =
    indicators.length > 0 && indicators.every((i) => checkedIndicators.has(i.id));

  const handleToggleCheck = useCallback((id: string, indicator: Indicator) => {
    setAllPagesSelected(false);
    setCheckedIndicators((prev) => {
      const next = new Map(prev);
      if (next.has(id)) next.delete(id);
      else next.set(id, indicator);
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    setAllPagesSelected(false);
    setCheckedIndicators((prev) => {
      const allChecked = indicators.every((i) => prev.has(i.id));
      const next = new Map(prev);
      if (allChecked) {
        indicators.forEach((i) => next.delete(i.id));
      } else {
        indicators.forEach((i) => next.set(i.id, i));
      }
      return next;
    });
  }, [indicators]);

  const handleClearSelection = useCallback(() => {
    setCheckedIndicators(new Map());
    setAllPagesSelected(false);
  }, []);

  const handleSelectAllPages = useCallback(() => {
    setAllPagesSelected(true);
  }, []);

  const handleExport = useCallback(async () => {
    if (allPagesSelected) {
      const response = await fetchIndicators({
        search: filters.search,
        severity: filters.severity,
        type: filters.type,
        source: filters.source,
        tags: filters.tags,
        page: 1,
        limit: total,
      });
      exportToCsv(response.data, 'indicators-all.csv');
    } else if (checkedIndicators.size > 0) {
      exportToCsv(Array.from(checkedIndicators.values()), 'indicators-selected.csv');
    } else {
      exportToCsv(indicators, 'indicators-export.csv');
    }
  }, [allPagesSelected, checkedIndicators, indicators, filters, total]);

  const showSelectionBar = allPagesSelected || checkedIndicators.size > 0;

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, fmt, intlLocale }}>
      <>
      <AppLayout sidebar={<Sidebar activeView={view} onNavigate={setView} />}>
        {view === 'settings' ? (
          <SettingsView theme={theme} onThemeChange={setTheme} />
        ) : (
          <>
            <PageHeader onExport={handleExport} secondsLeft={secondsLeft} onAddIndicator={() => setAddModalOpen(true)} />
            <StatsRow
              stats={stats}
              loading={statsLoading}
              onViewStats={() => setStatsModalOpen(true)}
              onFilterBySeverity={setSeverity}
            />
            <Toolbar
              search={filters.search ?? ''}
              severity={filters.severity}
              type={filters.type}
              source={filters.source}
              tags={filters.tags ?? []}
              availableTags={availableTags}
              onSearchChange={setSearch}
              onSeverityChange={setSeverity}
              onTypeChange={setType}
              onSourceChange={setSource}
              onTagsChange={setTags}
              onClear={reset}
              hasActiveFilters={hasActiveFilters}
            />
            {showSelectionBar && (
              <SelectionBar
                count={allPagesSelected ? total : checkedIndicators.size}
                total={total}
                allOnPageSelected={allOnPageSelected}
                allPagesSelected={allPagesSelected}
                onExport={handleExport}
                onClear={handleClearSelection}
                onSelectAllPages={handleSelectAllPages}
              />
            )}
            <div className={styles.contentRow}>
              <div className={styles.tableArea}>
                <IndicatorTable
                  indicators={displayIndicators}
                  loading={indicatorsLoading}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  hasFilters={hasActiveFilters}
                  checkedIds={checkedIds}
                  onToggleCheck={handleToggleCheck}
                  onToggleAll={handleToggleAll}
                  sort={sort}
                  onSort={toggleSort}
                />
                <Pagination
                  page={filters.page ?? 1}
                  totalPages={totalPages}
                  total={total}
                  limit={filters.limit ?? 20}
                  onPageChange={setPage}
                  onLimitChange={setLimit}
                />
              </div>
              {selectedId && (
                <DetailPanel id={selectedId} onClose={() => setSelectedId(null)} />
              )}
            </div>
          </>
        )}
      </AppLayout>
      {statsModalOpen && stats !== null && (
        <StatsModal stats={stats} onClose={() => setStatsModalOpen(false)} />
      )}
      {addModalOpen && (
        <AddIndicatorModal onClose={() => setAddModalOpen(false)} onAdd={handleAddIndicator} />
      )}
      {toast !== null && (
        <Toast message={toast} onDismiss={() => setToast(null)} />
      )}
      </>
    </LocaleContext.Provider>
  );
}

export default App;
