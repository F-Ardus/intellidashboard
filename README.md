# Augur Security — Threat Intelligence Dashboard

A React + TypeScript dashboard for displaying, filtering, and exploring threat intelligence indicators — built as a front-end engineering take-home assignment.

## Quick Start

```bash
npm install
npm run dev
```

Starts both the React dev server (`localhost:5173`) and the mock API (`localhost:3001`). Vite proxies `/api/*` requests to the API automatically.

```bash
npm test          # Run unit tests
npm run build     # TypeScript check + production build
npm run lint      # ESLint (zero warnings enforced)
```

---

## Architecture

### Tech Stack

| Concern | Choice                         | Why                                                                                 |
| ------- | ------------------------------ | ----------------------------------------------------------------------------------- |
| UI      | React 18 + TypeScript (strict) | Provided by starter; strict mode catches real bugs                                  |
| Build   | Vite                           | Fast HMR; native SCSS module support                                                |
| Styles  | CSS Modules + SCSS             | Scoped styles per component, shared design tokens via `:root` CSS custom properties |
| Testing | Vitest + React Testing Library | Jest-compatible, Vite-native                                                        |
| Icons   | Inline SVG                     | Zero bundle cost, fully themeable with `currentColor`                               |
| Dates   | `Intl.RelativeTimeFormat`      | Native browser API, no extra dependency                                             |

**No runtime dependencies beyond React.** Everything is built on the web platform.

### Project Structure

```
src/
├── api/              # Typed fetch wrappers for each endpoint
├── components/
│   ├── common/       # Reusable primitives: Button, Spinner, ErrorMessage
│   ├── detail/       # Slide-in indicator detail panel
│   ├── header/       # Page header and live feed badge
│   ├── layout/       # App shell: sidebar + main area
│   ├── pagination/   # Pagination controls
│   ├── stats/        # Stats summary row
│   ├── table/        # Data table, rows, badges, tags
│   └── toolbar/      # Search and filter controls
├── hooks/            # Custom React hooks (data fetching + UI state)
├── styles/
│   ├── _tokens.scss  # All :root CSS custom property declarations
│   └── global.scss   # CSS reset and global animations
├── types/            # TypeScript interfaces (indicator, stats)
└── utils/            # Pure utility functions (relative time formatting)
```

### Styling Approach

All design tokens live in `src/styles/_tokens.scss` as CSS custom properties on `:root`. This means:

- Every component can reference `var(--bg-surface)`, `var(--severity-critical)`, etc. without any SCSS imports
- Component `.module.scss` files are scoped automatically by Vite — no class name collisions
- Tokens can be overridden at any level for theming without touching component styles

### Data Flow

```
useFilters (UI state)
    ↓
useIndicators (fetch + AbortController) → /api/indicators
useStats (fetch once)                   → /api/stats
useIndicatorDetail (fetch on demand)    → /api/indicators/:id
    ↓
Components (pure, receive data as props)
```

`useIndicators` creates a new `AbortController` on every filter change. This prevents stale responses from a previous (slower) request from overwriting newer results — important because the mock API simulates 200–600ms of network latency.

The `source` filter is applied **client-side** after the API response, since the mock server does not support filtering by source. This is encapsulated in `useIndicators` so no component is aware of the difference.

---

## API Reference

Base URL: `http://localhost:3001` (proxied via Vite to `/api`)

| Endpoint              | Method | Description              |
| --------------------- | ------ | ------------------------ |
| `/api/indicators`     | GET    | Paginated indicator list |
| `/api/indicators/:id` | GET    | Single indicator details |
| `/api/stats`          | GET    | Summary statistics       |

### `/api/indicators` Query Parameters

| Parameter  | Type   | Default | Notes                                     |
| ---------- | ------ | ------- | ----------------------------------------- |
| `page`     | number | 1       | Page number                               |
| `limit`    | number | 20      | Max 100                                   |
| `severity` | string | —       | `critical` \| `high` \| `medium` \| `low` |
| `type`     | string | —       | `ip` \| `domain` \| `hash` \| `url`       |
| `search`   | string | —       | Partial match on value, source, or tags   |

---

## Implementation Log

Each commit in this repository represents one deliberate, self-contained improvement. The log below documents what was built and the reasoning behind each decision.

---

### `chore: scaffold project structure, add sass, and set up CSS design tokens`

**What changed:**

- Added `sass` as a devDependency (Vite supports `.module.scss` natively once installed)
- Removed a malformed directory (`src/{components,hooks,types,api,styles}/`) probably left by a brace-expansion bug in the starter zip
- Created the full directory structure: `src/api/`, `src/hooks/`, `src/utils/`, `src/components/` (with subfolders per concern)
- Extracted all design tokens from `design-reference.html` into `src/styles/_tokens.scss` as CSS custom properties
- Replaced `global.css` with `global.scss`: CSS reset, global animations (`shimmer`, `pulse`, `slideInRight`, `fadeIn`, `spin`), and scrollbar styling
- Added `src/types/stats.ts` for the `/api/stats` response shape

**Decisions:**

- **CSS Modules over global classes**: The design reference defines classes globally (`.badge-critical`, `.btn-primary`, etc.). Rather than copying these verbatim, each component gets its own `.module.scss`. This prevents accidental class collisions as the project grows and makes it clear which styles belong to which component.
- **SCSS over plain CSS**: Nesting makes component styles easier to read; `@use` for the token partial is explicit about dependencies. The tradeoff (one devDep: `sass`) is minimal.
- **Tokens as CSS custom properties, not SCSS variables**: CSS custom properties are available at runtime and can be inspected/overridden via DevTools. SCSS variables are compile-time only. For a design system meant to be themed, CSS custom properties are the right primitive.

---

### `feat: implement API client and data-fetching layer`

**What changed:**
- `src/api/client.ts` — `buildUrl()` builds typed query strings (skips `undefined`/empty values); `apiFetch<T>()` is a generic fetch wrapper that throws a typed `ApiError` on non-2xx responses and accepts an optional `AbortSignal`
- `src/api/indicators.ts` — `fetchIndicators(filters, signal)` and `fetchIndicatorById(id, signal)`
- `src/api/stats.ts` — `fetchStats(signal)`
- `src/utils/time.ts` — `formatRelativeTime()` using `Intl.RelativeTimeFormat` (no library); `formatAbsoluteTime()` for the detail panel timeline

**Decisions:**
- **`AbortSignal` threaded through every fetch**: The mock API simulates 200–600ms of latency on list requests. Without cancellation, rapidly changing filters can cause an older (slower) response to arrive after a newer (faster) one, silently overwriting the UI with stale data. Every fetch function accepts a signal so hooks can cancel in-flight requests when their inputs change.
- **`ApiError` as a typed class**: Catching `Error` gives you only a message. A typed `status: number` field lets calling code distinguish a 404 (missing indicator) from a 503 (server down) without string-parsing the message.
- **`buildUrl` filters out `undefined` and `''`**: The server treats `?severity=` (empty string) differently from omitting the param entirely. Stripping falsy values at the URL-building layer keeps every call site clean.
- **`Intl.RelativeTimeFormat` over a library**: `date-fns` or `dayjs` would add ~15KB gzipped for two helper functions. The native API covers everything needed here and works in every modern browser.

---

### `feat: implement custom hooks`

**What changed:**
- `src/hooks/useDebounce.ts` — generic `useDebounce<T>(value, delay)` using `setTimeout` + cleanup
- `src/hooks/useFilters.ts` — `UIFilters` state (extends `IndicatorFilters` with `source?: string`) and typed setters; every setter except `setPage` resets `page` to 1 automatically so stale pagination never survives a filter change
- `src/hooks/useStats.ts` — fetches `/api/stats` once on mount with `AbortController` cleanup
- `src/hooks/useIndicators.ts` — paginated fetch with `AbortController`; applies client-side source filtering post-response; destructures `filters` into primitive values so the `useEffect` dependency array only tracks what actually changes
- `src/hooks/useIndicatorDetail.ts` — fetches a single indicator by ID when `id` is non-null; preserves the last successful result in state so the detail panel doesn't flash to empty while the next indicator loads

**Decisions:**
- **`UIFilters` extends `IndicatorFilters` in the hook layer, not the type layer**: The `IndicatorFilters` interface in `src/types/indicator.ts` mirrors the API contract exactly. Adding `source` there would imply the server supports it. By extending in `useFilters.ts`, the divergence is contained — no component or API function is aware of it.
- **Destructuring `filters` before `useEffect`**: ESLint's `react-hooks/exhaustive-deps` rule requires that everything referenced inside an effect appears in the dependency array. If `filters` (an object) were in the array, the effect would re-run on every render because object references change each render even with identical values. Destructuring to primitives (`search`, `severity`, `type`, …) gives the rule exactly what it needs while ensuring the effect only re-runs when values actually change.
- **`useIndicatorDetail` does not reset `indicator` to `null` on ID change**: If the panel were cleared while fetching, you'd see a flash of empty content between row selections. Keeping the previous result visible until the new one arrives makes the transition feel instant.

---

### `feat: implement AppLayout and Sidebar`

**What changed:**
- `src/components/layout/AppLayout.tsx` — CSS grid shell (`var(--sidebar-width) 1fr`); accepts `sidebar` and `children` slots
- `src/components/layout/Sidebar.tsx` — logo with inline SVG shield, four nav sections (main, Intelligence, Reports, Settings), inline SVG icons per nav item, badge support; "Threat Indicators" marked active
- `src/App.tsx` — replaced the starter placeholder; now renders `AppLayout` with `Sidebar`; `selectedId` state deferred to the commit that wires the detail panel

**Decisions:**
- **Nav items as `<button>` elements**: Using `<button>` instead of `<a>` keeps the markup semantically correct for a single-page app with no router — buttons trigger actions, anchors navigate to URLs. Accessibility tools (screen readers, keyboard nav) treat them appropriately.
- **`children` is optional on `AppLayout`**: The slot is built up incrementally across commits. Making it required would cause type errors in every intermediate state before the dashboard content exists.
- **SVG icons inline, not from a library**: Each icon is ~5 lines of SVG. An icon library would add a dependency, a bundle hit, and an import per component for what is essentially static markup. Inline SVGs also inherit `currentColor` from CSS, so active/hover states require zero extra styling.
- **Nav data as a static array (`NAV_SECTIONS`)**: Defining navigation structure as data rather than JSX makes it easy to add, remove, or reorder items without touching render logic. When routing is added later, the `active` flag becomes a computed prop based on the current route.

---

### `feat: add shared primitive components`

**What changed:**
- `src/components/common/Button.tsx` — `variant` (`primary` | `secondary` | `ghost` | `danger`) and `size` (`sm` | `md`) props; spreads remaining `ButtonHTMLAttributes` so it's a drop-in replacement for `<button>`
- `src/components/common/Spinner.tsx` — CSS-only rotating ring via the global `spin` keyframe; three sizes
- `src/components/common/ErrorMessage.tsx` — alert banner with an optional `onRetry` callback
- `src/components/table/SeverityBadge.tsx` — colored badge driven by the `Severity` union type; CSS module class selected by severity value
- `src/components/table/TypeIcon.tsx` — inline SVG per `IndicatorType`; `size` prop for reuse at different scales
- `src/components/table/ConfidenceBar.tsx` — 60px track with fill colored by `severity`; monospace percentage label
- `src/components/table/TagPill.tsx` — deterministic color from `charCodeSum(tag) % 5`; same tag string always maps to the same color across the whole app without a lookup table or server-side data

**Decisions:**
- **`Button` spreads `ButtonHTMLAttributes`**: Rather than enumerating `onClick`, `disabled`, `type`, etc. as explicit props, spreading the full HTML attribute set means `Button` works everywhere `<button>` does — form submits, disabled states, ARIA attributes — without wrapper boilerplate.
- **`ConfidenceBar` takes `severity` rather than a hex color**: Passing a semantic value keeps the component decoupled from specific color values. If the design tokens change, only `_tokens.scss` needs updating — not every call site.
- **`TypeIcon` has no SCSS module**: It's pure SVG with no layout or box-model concerns. Adding a module just for `width`/`height` would be noise — those are controlled by the `size` prop directly.

---

### `feat: add PageHeader with LiveFeedBadge`

**What changed:**
- `src/components/header/LiveFeedBadge.tsx` — pulsing green dot + "Live feed" label; dot uses the global `pulse` keyframe and `box-shadow` glow with `var(--status-active)`
- `src/components/header/PageHeader.tsx` — sticky header with title, subtitle, `LiveFeedBadge`, and Export/Add Indicator action buttons wired to optional callback props
- `src/App.tsx` — `PageHeader` added as the first child of the layout

**Decisions:**
- **`onExport` and `onAddIndicator` as optional props**: The buttons are visible in the design from the start, but their functionality belongs to later feature commits (CSV export, Add Indicator modal). Making the callbacks optional means the header renders correctly now without stub implementations leaking into `App.tsx`.
- **`position: sticky; top: 0`** on the header: The table can be long — keeping the title and actions always visible matches the design spec and is a standard pattern for data-heavy dashboards.
- **`LiveFeedBadge` as its own component**: The pulsing dot + label is a self-contained visual with its own animation state. Extracting it keeps `PageHeader` focused on layout and makes the badge independently reusable (e.g. in a future status bar).

---

### `feat: add StatsRow and StatCard wired to live /api/stats data`

**What changed:**
- `src/components/stats/StatCard.tsx` — displays label, formatted value, sub-label, and optional icon; renders a shimmer skeleton when `value === null` (while loading)
- `src/components/stats/StatsRow.tsx` — 5-column grid of `StatCard`s; consumes `useStats` result passed as props; shield icon on Total card matches design reference exactly
- `src/App.tsx` — `useStats` called here; `stats` and `loading` passed into `StatsRow`

**Decisions:**
- **`value: number | null` drives the skeleton**: Rather than a separate `loading` prop per card, `null` means "not yet loaded" and renders the shimmer. This keeps the API surface minimal and makes the loading state impossible to forget — you can't pass a number and accidentally show a skeleton.
- **Variant color overrides nested as `&.critical .value`**: In CSS Modules, scoped class names must resolve as descendant selectors. `&.critical .value` compiles to `.card.critical .value` — the variant class and `.card` sit on the same element, with `.value` as a child. A flat `.critical .value` at root level would fail because both scoped names would need to be on separate ancestor/descendant elements.
- **Sub-labels are static strings**: The design reference uses fixed copy ("Requires immediate action", "Active monitoring", etc.). The live API doesn't return trend data, so hardcoding these matches the spec without fabricating data.

---

### `feat: add Toolbar with search, severity, type, and source filters`

**What changed:**
- `src/components/toolbar/SearchInput.tsx` — icon + text input; debounces via `useDebounce` (300ms) internally and emits the debounced value up to the parent; a second `useEffect` syncs back down when the parent resets filters so the input clears correctly
- `src/components/toolbar/FilterSelect.tsx` — reusable `<select>` wrapper; prepends an empty-value "All X" option; emits an empty string when the placeholder is selected
- `src/components/toolbar/Toolbar.tsx` — composes the three filters in a flex row with a divider; SOURCE_OPTIONS mirrors the mock server's data exactly (16 sources); renders the "Clear filters" button only when `hasActiveFilters` is true
- `src/App.tsx` — `useFilters` wired in; all filter state and setters passed to `Toolbar`

**Decisions:**
- **Debounce inside `SearchInput`, not the parent**: The 300ms delay is an implementation detail of the text input — the parent (`App`) just receives a string and doesn't care how it was produced. Keeping the debounce inside the component means every consumer gets it for free without extra wiring.
- **Two `useEffect`s in `SearchInput`**: The first syncs the debounced local value up to the parent (on debounced change). The second syncs the parent-provided value back down (on reset). Combining them into one would create a feedback loop — the parent update would re-trigger the debounce, which would re-update the parent, and so on.
- **`FilterSelect` emits empty string, caller converts to `undefined`**: The `<select>` DOM element works with string values. Converting `''` → `undefined` at the `Toolbar` level (before it reaches `useFilters`) keeps `FilterSelect` generic and reusable — it knows nothing about the `Severity` or `IndicatorType` union types.
- **Source filter is a static list, not fetched from the API**: The mock server doesn't expose a `/api/sources` endpoint. The list is hardcoded to match `server/data.js` exactly, which is fine for the scope of this project. If sources were dynamic, the correct fix would be adding a server endpoint — not fetching all indicators just to extract unique source values client-side.
- **`useFilters` setters wrapped in `useCallback`**: The setter functions were originally plain function declarations inside the hook body, meaning a new reference on every render. `SearchInput` depends on `onChange` in a `useEffect`, so an unstable reference caused an infinite re-render loop. `useCallback` with an empty dependency array fixes this — the setters only close over `setFilters`, which is itself stable.

---

### `feat: add IndicatorTable with SkeletonRow and EmptyState`

**What changed:**
- `src/components/table/IndicatorTable.tsx` — table shell with `<thead>` (7 columns); renders 5 `SkeletonRow`s while loading, `EmptyState` on zero results, or `IndicatorRow`s for live data
- `src/components/table/IndicatorRow.tsx` — single `<tr>` with all columns: indicator value (monospace, blue), type with `TypeIcon`, `SeverityBadge`, source, `ConfidenceBar`, relative last-seen time, and `TagPill`s
- `src/components/table/SkeletonRow.tsx` — shimmer placeholder row; each cell has a `<div>` with varied widths so the skeleton looks like real content
- `src/components/table/EmptyState.tsx` — centered state rendered inside a full-width `<td colSpan={7}>`; message adapts based on whether filters are active
- `src/App.tsx` — `useIndicators` wired in; `selectedId` state introduced; `IndicatorTable` receives live data, loading state, and selection callbacks

**Decisions:**
- **`loading` vs empty handled in the table, not the parent**: The table knows its own three states (loading, empty, populated). Lifting that logic into `App` would require the parent to know about column counts and skeleton counts — details that belong to the table component.
- **`EmptyState` message adapts to filter context**: "No indicators found — try adjusting your filters" is more useful than a generic message when the user has active filters. The `hasFilters` prop passes through from `App` where filter state already lives.
- **Skeleton widths varied per column**: Each column has a width that approximates its real content (160px for the indicator value, 56px for the severity badge, etc.). Uniform-width skeletons would look obviously fake and make the layout shift more jarring when real data loads.
- **Row styles in `IndicatorRow.module.scss`, not `IndicatorTable.module.scss`**: The `<tr>` hover, selected, and cell padding styles belong to the row component. The table module only owns the container border, `border-collapse`, and `<thead>` background — layout concerns, not row concerns.

---

### `feat: add Pagination and wire full table to live API data`

**What changed:**
- `src/components/pagination/Pagination.tsx` — page info label, prev/next arrow buttons, and numbered page buttons with ellipsis compression; returns `null` when `totalPages <= 1` so it self-hides on single-page results
- `src/components/pagination/Pagination.module.scss` — 30×30px buttons, 4px gap, active page highlighted with `--augur-blue`, disabled state at 35% opacity
- `src/App.tsx` — `setPage` and pagination data (`total`, `totalPages`) wired in; `Pagination` rendered below the table

**Decisions:**
- **`buildPages` produces a stable 7-item window**: The function always returns at most 7 entries (numbers or `'…'`), so the pagination bar never changes width as the user pages through results. Three cases: all pages fit (≤7 total), near the start, near the end, or in the middle — each produces a predictable layout.
- **Ellipsis rendered as a disabled button, not a `<span>`**: Keeping the ellipsis as a `<button>` (disabled, no border) maintains the uniform height and alignment of the controls row without any extra layout rules. A `<span>` would require explicit sizing to match.
- **`Pagination` returns `null` when `totalPages <= 1`**: No pagination bar is needed for a single page of results. Hiding it rather than disabling buttons avoids a confusing empty row at the bottom of the table.
- **`total` and `limit` used for the "Showing X–Y of Z" label**: The label is computed from `(page - 1) * limit + 1` to `min(page * limit, total)`, using `toLocaleString` for comma-formatted numbers — matching the design reference exactly.

---

### `feat: add DetailPanel with slide-in animation`

**What changed:**
- `src/components/detail/DetailPanel.tsx` — fixed slide-in panel showing Value, Classification (badge + type), Confidence Score (wide bar + large percentage), Tags, Timeline (first/last seen), Source, and Investigate/Block action buttons
- `src/components/detail/DetailPanel.module.scss` — `position: fixed; right: 0; top: 0; height: 100vh; width: var(--detail-width)` (400px); uses the global `slideInRight` keyframe; sticky header with close button
- `src/App.tsx` — `selectedId` conditionally renders `<DetailPanel>`; `onClose` resets `selectedId` to `null`

**Decisions:**
- **Panel only mounts when `selectedId` is non-null**: Rather than always rendering the panel and toggling visibility with CSS, the panel is conditionally mounted. This means `useIndicatorDetail` only fetches when there's actually something to show, and the `slideInRight` animation fires naturally on mount every time a row is selected.
- **`useIndicatorDetail` does not reset on ID change**: When the user clicks a different row, the previous indicator stays visible until the new fetch resolves. This eliminates the flash of empty content between selections — the panel feels instant.
- **Confidence bar is wider in the panel (120px, 6px tall) than in the table (60px, 4px)**: The panel has more horizontal space and the confidence score is a focal point — the larger bar gives it appropriate visual weight without changing the `ConfidenceBar` component. The panel renders its own bar directly rather than reusing the table component at a different size.
- **Action buttons are non-functional stubs**: "Investigate" and "Block" are in the design reference and establish the interaction model. Their functionality (deep-link to investigation tools, block-list API) belongs to a separate feature commit and isn't fabricated here.

---

### `feat: add row checkboxes and compress table layout when detail panel is open`

**What changed:**
- `src/components/table/IndicatorTable.tsx` — added checkbox column; header checkbox uses a `ref` to set the native `indeterminate` property when some (not all) rows are checked; `checkedIds`, `onToggleCheck`, and `onToggleAll` props added
- `src/components/table/IndicatorRow.tsx` — checkbox cell added as first column; `onClick` on the checkbox calls `e.stopPropagation()` so checking a row does not also open the detail panel
- `src/components/table/SkeletonRow.tsx` / `EmptyState.tsx` — updated to account for the new column (8 total)
- `src/components/detail/DetailPanel.module.scss` — changed from `position: fixed` (full-viewport overlay) to `position: sticky; top: 0; height: 100vh` so the panel sits beside the table in the document flow
- `src/App.module.scss` — `.contentRow` flex wrapper and `.tableArea` flex child manage the table/panel split
- `src/App.tsx` — `checkedIds: Set<string>` state, `handleToggleCheck` and `handleToggleAll` with `useCallback`; `contentRow` layout applied

**Decisions:**
- **Panel compresses the table instead of overlaying it**: When the detail panel is open, the table shrinks to the remaining width. This keeps the table's tag column visible and avoids the panel covering rows the user might want to click. A fixed overlay obscures content — especially problematic for the tags column on the right.
- **`indeterminate` via `ref`, not state**: React has no prop for the checkbox `indeterminate` state — it must be set imperatively on the DOM element. A `useRef` + `useEffect` handles this without adding any extra state.
- **`e.stopPropagation()` on checkbox click**: The `<tr>` click handler opens the detail panel. Without stopping propagation, clicking a checkbox would simultaneously check the row *and* open the panel — two unrelated actions firing from one click. Stopping propagation keeps them independent.
- **`handleToggleAll` computes state from current `indicators`, not `checkedIds` alone**: Toggle-all on a paginated list should only act on the visible page, not all pages. Deriving the "all checked" state from `indicators` (current page) ensures checking/unchecking only affects what the user can see.
- **`checkedIds` persists across page changes intentionally**: Navigating to another page does not clear checked rows. This supports a future "export selected" workflow where an analyst checks rows across multiple pages before exporting in bulk.

---

### `test: add unit tests and reorganize components into per-component subfolders`

**What changed:**
- `vite.config.ts` — added `test` block: `globals: true`, `environment: 'jsdom'`, `setupFiles: ['./src/test/setup.ts']`
- `src/utils/time.test.ts` — `formatRelativeTime` tested across seconds/minutes/hours/days using `vi.useFakeTimers`; `formatAbsoluteTime` smoke-tested for non-empty output
- `src/hooks/useDebounce.test.ts` — initial value, no-update before delay, update after delay, timer reset on rapid changes
- `src/hooks/useFilters.test.ts` — default state, page reset on `setSearch`/`setSeverity`, `setPage` does not clobber other filters, `reset` restores defaults, **setter reference stability** (all six setters are `===` identical across re-renders)
- `src/components/pagination/Pagination/buildPages.ts` — `buildPages` extracted to its own file and tested: all-pages case, start/end/middle ellipsis cases, always-7-entries invariant, active page always present
- `src/components/table/SeverityBadge/SeverityBadge.test.tsx` — all four severities render correct label text
- `src/components/table/EmptyState/EmptyState.test.tsx` — filter-aware message, no-filter message, title always present
- All components moved from flat feature folders (`table/Button.tsx`) into per-component subfolders (`table/Button/Button.tsx`) with colocated styles and tests; all cross-component imports updated accordingly

**Decisions:**
- **Per-component subfolders over flat feature folders**: With 7+ components in `table/` each having a `.tsx`, `.module.scss`, and optionally a `.test.tsx`, the flat layout becomes hard to scan. Subfolders group each component's files as a unit — you open a folder, you see everything related to that component.
- **No barrel files**: Barrel `index.ts` files clean up import paths but hurt tree-shaking, slow TypeScript resolution in large projects, and obscure "go to definition" navigation. Direct imports (`../SeverityBadge/SeverityBadge`) are one segment longer but explicit and fast.
- **`buildPages` extracted to `buildPages.ts`**: The linter (`react-refresh/only-export-components`) flags non-component exports from component files as harmful to fast refresh. Moving the pure function to its own file resolves this and also makes the separation of concerns explicit — the file that renders buttons doesn't need to contain the algorithm that decides which buttons to show.
- **Setter stability test in `useFilters`**: The `useCallback` fix earlier in this project was made specifically because unstable setter references caused an infinite render loop. The test locks in that fix — if someone removes `useCallback`, the test fails and explains why.
- **`vi.useFakeTimers` for time-dependent tests**: Both `useDebounce` and `formatRelativeTime` depend on time. Fake timers make these tests deterministic and instant — no real waiting.
- **Tests cover utility, hook, and component layers**: Each layer has different failure modes. Utility tests catch pure logic bugs. Hook tests catch state management bugs. Component tests catch rendering regressions. Together they give meaningful coverage without testing implementation details of every component.

---

### `feat: bulk export, rows-per-page selector, and cross-page select-all`

**What changed:**
- `src/utils/exportCsv.ts` — pure utility that converts `Indicator[]` to a CSV blob and triggers a browser download; handles RFC 4180 quoting (commas, quotes, newlines in values)
- `src/hooks/useFilters.ts` — `setLimit` setter added (resets page to 1 on change); default limit changed to 10
- `src/components/toolbar/SelectionBar/SelectionBar.tsx` — contextual action bar appearing above the table when rows are checked; shows count, "Export CSV", "Clear selection", and a Gmail-style prompt ("You are only selecting indicators on this page. Select all X instead?") when all items on the current page are selected but more exist across pages
- `src/components/pagination/Pagination/Pagination.tsx` — rows-per-page `<select>` (10/20/50/100) added between the info text and page buttons
- `src/App.tsx` — `checkedIndicators: Map<string, Indicator>` tracks full indicator objects; `allPagesSelected: boolean` flag for cross-page selection; `handleExport` fetches all matching indicators server-side when `allPagesSelected` is true; `PageHeader`'s `onExport` wired up

**Decisions:**
- **`Map<string, Indicator>` instead of `Set<string>`**: Storing full indicator objects (keyed by ID) means export data is available regardless of which page the user is on. A `Set` of IDs would silently drop checked rows that had been paged away.
- **Export falls back to current view when nothing is selected**: Clicking "Export" in the page header with no rows checked exports the visible filtered page — two distinct but natural workflows from one button.
- **CSV quoting follows RFC 4180**: Values containing commas, double-quotes, or newlines are wrapped in double-quotes; internal double-quotes are escaped by doubling them. Opens correctly in Excel and Google Sheets without manual cleanup.
- **`allPagesSelected` is a boolean flag, not a full data fetch**: The flag is cheap; the actual data fetch only happens at export time, using the current filter state to reconstruct the full set server-side.
- **Rows-per-page lives in the pagination bar, not the toolbar**: It's a display density preference directly related to pagination — contextually it belongs beside the page controls, not next to severity and type filters.
- **`setLimit` resets page to 1**: Changing from 10 to 50 rows per page while on page 5 would often produce an out-of-range page. Resetting to 1 is the universal convention.
- **Cross-page prompt copy leads into the action**: "You are only selecting indicators on this page. Select all X instead?" — the first sentence sets context, the button answers it naturally.

---

### `feat: URL filter persistence via query params`

**What changed:**
- `src/hooks/useFilters.ts` — `parseFiltersFromUrl()` reads initial state from `window.location.search` on mount; `filtersToUrl()` serialises current filters back to a query string; a `useEffect` calls `history.replaceState` on every filter change to keep the URL in sync; invalid values from the URL (e.g. unknown severity strings) are discarded and fall back to defaults

**Decisions:**
- **`history.replaceState`, not `pushState`**: Pushing a new history entry on every filter change would mean hitting the back button 10 times to undo 10 keystrokes. `replaceState` keeps the address bar current without polluting the history stack.
- **Default values omitted from the URL**: `?q=malware&severity=critical` is cleaner and more shareable than `?q=malware&severity=critical&page=1&limit=10`. Defaults are stripped at serialisation and assumed at parse time.
- **Invalid URL values are validated and discarded**: A user or external system could craft a URL with `?severity=unknown`. The parse function checks against `VALID_SEVERITIES` and `VALID_TYPES` before accepting a value, so the app never passes an invalid filter to the API.
- **`useState(parseFiltersFromUrl)` uses the lazy initialiser form**: Passing the function reference (not the call) means it runs once on mount rather than on every render — the same pattern as any expensive initial state computation.
- **No router dependency**: `URLSearchParams` and `history.replaceState` are standard browser APIs. Adding a router (React Router, TanStack Router) would be the right call if this app had multiple pages, but for a single-page dashboard it adds complexity with no benefit.

---

### `feat: auto-refresh with countdown`

**What changed:**
- `src/hooks/useAutoRefresh.ts` — new hook that ticks a 30-second interval and calls a stable callback when it elapses; returns `secondsLeft` for display
- `src/hooks/useStats.ts` — added `refreshKey` parameter; included in `useEffect` dependency array so re-fetches trigger when the key increments
- `src/hooks/useIndicators.ts` — same `refreshKey` pattern as `useStats`
- `src/components/header/LiveFeedBadge/LiveFeedBadge.tsx` — renders the `secondsLeft` countdown beside "Live feed" text; `font-variant-numeric: tabular-nums` prevents the layout from shifting as digits change width
- `src/components/header/PageHeader/PageHeader.tsx` — accepts `secondsLeft?: number` (default 30) and passes it to `LiveFeedBadge`
- `src/App.tsx` — `refreshKey` integer state; `handleRefresh` increments it; `useAutoRefresh(handleRefresh)` drives the countdown; `refreshKey` passed to both `useStats` and `useIndicators`; `secondsLeft` passed to `PageHeader`

**Decisions:**
- **`callbackRef` pattern in `useAutoRefresh`**: The interval is set up once on mount with an empty dependency array — it never restarts. But the callback (`handleRefresh`) could theoretically change across renders. A `useRef` always holds the latest version of the callback, so the interval calls `callbackRef.current()` instead of closing over a stale value. This avoids the dilemma between restarting the interval (resetting the countdown) and calling a stale function.
- **`refreshKey` integer over a `Date` timestamp**: Incrementing a counter is the minimal change that breaks React's dependency equality check. A timestamp would work identically but adds semantic noise — this isn't a timestamp, it's a trigger.
- **Both `useStats` and `useIndicators` share the same `refreshKey`**: A single increment refreshes stats and the indicator list atomically. Using separate keys would allow them to drift out of sync.
- **`font-variant-numeric: tabular-nums` on the countdown**: Proportional digits cause the countdown span to shift width as numbers change (e.g. "9s" is narrower than "10s"). Tabular numerals have fixed widths, keeping the badge layout stable.
- **30-second interval, not configurable**: The mock API's simulated latency (200–600ms) and the nature of threat intelligence data both suit a 30-second poll. Making the interval configurable would add complexity with no current benefit.

---

### `feat: add column sort`

**What changed:**
- `src/hooks/useSort.ts` — `SortField` (`value` | `type` | `severity` | `source` | `confidence` | `lastSeen`), `SortDir`, `SortState` types; `sortIndicators()` pure function using `localeCompare` for strings, numeric compare for confidence, date compare for lastSeen, and a rank map for severity; `useSort()` hook that toggles direction on repeated clicks and resets to `desc` when switching columns
- `src/components/table/IndicatorTable/IndicatorTable.tsx` — `SortableTh` inner component renders a `<button>` inside the `<th>` with an animated caret; all columns except Tags are now sortable
- `src/components/table/IndicatorTable/IndicatorTable.module.scss` — `.thSortable`, `.sortBtn`, `.sortActive`, `.caret`, `.caretVisible`, `.caretAsc` styles; `background: none; border: none` on the button to avoid browser default chrome; caret rotates 180° for ascending via CSS `transform` transition
- `src/App.tsx` — `useSort()` called alongside `useIndicators`; `sortedIndicators` derived via `useMemo`; `sortedIndicators` (not raw `indicators`) passed to `IndicatorTable`

**Decisions:**
- **Client-side sort, not a new API param**: The API supports `severity`, `type`, `search`, and `page` filters but has no sort parameter. Sorting client-side on the fetched page is accurate for what's visible and avoids adding a non-existent API capability.
- **All columns sortable except Tags**: Every scalar field has a natural sort order. Tags is an array — sorting by array contents is ambiguous (first tag? count?) and unlikely to be useful for an analyst.
- **`useMemo` for the sorted array**: Sorting is O(n log n) and runs on every render if unguarded. `useMemo` ensures it only re-runs when `indicators` or `sort` actually changes.
- **Direction resets to `desc` when switching columns**: Clicking a new column immediately shows the most relevant extreme (highest confidence, most recent date, highest severity) rather than starting from the opposite end. Clicking the same column again toggles.
- **Caret hidden via `opacity: 0`, not `display: none`**: The caret element always occupies space so the column header width doesn't shift when sort activates. `opacity` transition also gives a smooth fade-in.
- **`aria-sort` on the `<button>`**: Screen readers can announce the current sort direction on each column without relying on the visual caret.

---

### `feat: add Stats modal with SVG donut chart`

**What changed:**
- `src/components/stats/StatsModal/StatsModal.tsx` — modal with a header, left panel (SVG donut chart + legend), and right panel (KPI table); `DonutChart` and `KpiTable` are private sub-components in the same file; `pct()` helper formats percentages
- `src/components/stats/StatsModal/StatsModal.module.scss` — overlay with `backdrop-filter: blur(4px)`; `slideUp` + `fadeIn` entry animations; donut sizing matches design reference (140×140, `rotate(-90deg)` so arc starts at 12 o'clock); legend uses CSS grid for aligned columns; KPI table mirrors design reference column styles
- `src/components/stats/StatCard/StatCard.tsx` — optional `onClick` prop; `role="button"` and `tabIndex={0}` when clickable
- `src/components/stats/StatCard/StatCard.module.scss` — `.clickable` modifier: `cursor: pointer`, stronger hover state
- `src/components/stats/StatsRow/StatsRow.tsx` — optional `onViewStats` prop; only attaches `onClick` to cards when stats are loaded (not during skeleton state)
- `src/App.tsx` — `statsModalOpen` state; `setStatsModalOpen(true)` passed as `onViewStats`; modal rendered in a fragment alongside `AppLayout`, guarded by `stats !== null`

**Decisions:**
- **Pure SVG arcs via `stroke-dasharray`/`stroke-dashoffset`**: Each severity segment is a `<circle>` with a dash pattern sized to its proportion of the circumference. Accumulated offsets position each arc where the previous one ended. No chart library needed — the math is five lines.
- **`rotate(-90deg)` on the SVG element**: SVG circles start at the 3 o'clock position by default. Rotating the whole SVG (not individual arcs) moves the start to 12 o'clock without changing the offset math.
- **Modal rendered outside `AppLayout` in a fragment**: The modal uses `position: fixed` and needs to sit above all layout stacking contexts. Rendering it as a sibling to `AppLayout` avoids any `overflow: hidden` or `z-index` containment on the layout shell clipping the overlay.
- **Cards only become clickable after stats load**: Attaching `onClick` during skeleton state would let users open an empty modal. Guarding with `stats !== null && !loading` ensures the modal always has data to show.
- **Clicking the overlay closes the modal, `stopPropagation` on the modal itself**: Standard modal dismiss pattern — clicking outside closes, clicking inside does not.
- **Only the Total card opens the modal; severity cards filter the table**: The Total card is the natural entry point for a breakdown — it owns the aggregate. Severity cards (Critical, High, Medium, Low) are more useful as one-click filters that jump straight to the relevant rows. The two interactions are distinct and each does the most useful thing for that card.
- **Severity cards are not clickable while loading**: Attaching `onClick` during skeleton state would silently do nothing or open an empty modal. Guarding with `ready` (stats loaded and not null) ensures every click has a visible effect.

---
