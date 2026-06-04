// Date helpers shared across components.

/** Format an ISO date string as e.g. "4 Jun 2026". Returns '' for empty input. */
export function formatDate(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * A task is overdue when it has a due date in the past (before today) and is
 * not yet complete. Comparison is done at day granularity so a task due today
 * is not flagged as overdue.
 */
export function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const due = new Date(task.dueDate);
  if (Number.isNaN(due.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due < today;
}
