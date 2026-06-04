import { useEffect, useMemo, useState } from 'react';
import { tasksApi } from './api.js';
import TaskForm from './components/TaskForm.jsx';
import FilterBar from './components/FilterBar.jsx';
import TaskList from './components/TaskList.jsx';
import EmptyState from './components/EmptyState.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [status, setStatus] = useState('all'); // all | active | completed
  const [search, setSearch] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  // Load all tasks once on mount. We keep the full list in state as the single
  // source of truth and filter/search on the client for instant feedback and
  // accurate counts. (The API also supports ?status= and ?search= server-side.)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await tasksApi.list();
        if (!cancelled) setTasks(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeCount = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks]);
  const completedCount = tasks.length - activeCount;

  const visibleTasks = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tasks.filter((task) => {
      if (status === 'active' && task.completed) return false;
      if (status === 'completed' && !task.completed) return false;
      if (term && !task.title.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [tasks, status, search]);

  async function handleAdd(payload) {
    const created = await tasksApi.create(payload);
    setTasks((prev) => [created, ...prev]);
  }

  async function handleToggle(task) {
    try {
      const updated = await tasksApi.update(task.id, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate(id, changes) {
    const updated = await tasksApi.update(id, changes);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  async function confirmDelete() {
    const task = pendingDelete;
    setPendingDelete(null);
    try {
      await tasksApi.remove(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Task Manager</h1>
        <p className="mt-1 text-sm text-slate-500">
          A simple personal to-do list. {activeCount} active, {completedCount} completed.
        </p>
      </header>

      <div className="space-y-6">
        <TaskForm onAdd={handleAdd} />

        <FilterBar
          status={status}
          onStatusChange={setStatus}
          search={search}
          onSearchChange={setSearch}
          activeCount={activeCount}
          completedCount={completedCount}
        />

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : visibleTasks.length === 0 ? (
          <EmptyState filtered={tasks.length > 0} />
        ) : (
          <TaskList
            tasks={visibleTasks}
            onToggle={handleToggle}
            onUpdate={handleUpdate}
            onDelete={setPendingDelete}
          />
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete task?"
        message={`"${pendingDelete?.title}" will be permanently removed. This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <ul className="space-y-3" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <li key={i} className="h-20 animate-pulse rounded-xl bg-white shadow-sm ring-1 ring-slate-200" />
      ))}
    </ul>
  );
}
