export interface Translations {
  nav: {
    dashboard: string;
    settings: string;
    intelligence: string;
    reports: string;
    augurEvents: string;
    investigate: string;
    threatIndicators: string;
    campaigns: string;
    actors: string;
    executiveReports: string;
    analytics: string;
    integrations: string;
  };
  header: {
    title: string;
    subtitle: string;
    export: string;
    addIndicator: string;
    liveFeed: string;
  };
  stats: {
    total: string;
    totalSub: string;
    critical: string;
    criticalSub: string;
    high: string;
    highSub: string;
    medium: string;
    mediumSub: string;
    low: string;
    lowSub: string;
  };
  toolbar: {
    searchPlaceholder: string;
    allSeverities: string;
    allTypes: string;
    allSources: string;
    clearFilters: string;
    tagsPlaceholder: string;
    noMoreTags: string;
    severity: { critical: string; high: string; medium: string; low: string };
    type: { ip: string; domain: string; hash: string; url: string };
    presets: string;
    savePreset: string;
    savePresetPlaceholder: string;
    noPresets: string;
    deletePreset: string;
  };
  table: {
    indicator: string;
    type: string;
    severity: string;
    source: string;
    confidence: string;
    lastSeen: string;
    tags: string;
    noResults: string;
    noResultsFiltered: string;
    noResultsEmpty: string;
  };
  pagination: {
    showing: string;
    rows: string;
    previousPage: string;
    nextPage: string;
  };
  selection: {
    allSelected: string;
    countSelected: string;
    countSelectedPlural: string;
    pageOnlyNote: string;
    selectAllInstead: string;
    clearFullSelection: string;
    clearSelection: string;
    exportCsv: string;
  };
  detail: {
    title: string;
    value: string;
    classification: string;
    confidenceScore: string;
    tags: string;
    timeline: string;
    firstSeen: string;
    lastSeen: string;
    source: string;
    provider: string;
    investigate: string;
    block: string;
    blockTooltip: string;
  };
  addIndicator: {
    title: string;
    valueLabelText: string;
    valuePlaceholder: string;
    valueRequired: string;
    typeLabel: string;
    typeRequired: string;
    selectType: string;
    severityLabel: string;
    severityRequired: string;
    selectSeverity: string;
    sourceLabel: string;
    sourceRequired: string;
    selectSource: string;
    confidenceLabel: string;
    tagsLabel: string;
    tagsOptional: string;
    cancel: string;
    submit: string;
  };
  statsModal: {
    title: string;
    severityDistribution: string;
    total: string;
    byType: string;
    typeCount: string;
    typePct: string;
    critical: string;
    high: string;
    medium: string;
    low: string;
    ip: string;
    domain: string;
    hash: string;
    url: string;
  };
  settings: {
    title: string;
    subtitle: string;
    appearance: string;
    systemTheme: string;
    systemThemeDesc: string;
    theme: string;
    themeDesc: string;
    language: string;
    languageDesc: string;
    tableSection: string;
    density: string;
    densityDesc: string;
    densityCompact: string;
    densityNormal: string;
    densityComfortable: string;
    expandTags: string;
    expandTagsDesc: string;
  };
  toast: {
    indicatorAdded: string;
  };
  tour: {
    skip: string;
    finish: string;
    steps: Array<{
      title: string;
      description: string;
      fallbackDescription?: string;
    }>;
  };
}
