const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

/**
 * Status filter tabs, a title search box, and the active/completed counts.
 */
export default function FilterBar({
  status,
  onStatusChange,
  search,
  onSearchChange,
  activeCount,
  completedCount,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="inline-flex rounded-lg bg-white p-1 shadow-sm ring-1 ring-slate-200">
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => onStatusChange(filter.key)}
            aria-pressed={status === filter.key}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              status === filter.key
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-slate-500 sm:inline">
          {activeCount} active · {completedCount} done
        </span>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title…"
          aria-label="Search tasks by title"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-56"
        />
      </div>
    </div>
  );
}
