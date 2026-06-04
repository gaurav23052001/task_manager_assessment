/**
 * Shown when the task list is empty. The message adapts to whether the list
 * is genuinely empty or just filtered down to nothing.
 */
export default function EmptyState({ filtered }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white/50 p-10 text-center">
      <p className="text-base font-medium text-slate-600">
        {filtered ? 'No tasks match your filters.' : 'No tasks yet.'}
      </p>
      <p className="mt-1 text-sm text-slate-400">
        {filtered
          ? 'Try a different filter or search term.'
          : 'Add your first task using the form above.'}
      </p>
    </div>
  );
}
