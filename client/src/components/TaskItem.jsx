import { useState } from 'react';
import { formatDate, isOverdue } from '../utils/date.js';

/**
 * A single task row. Has two modes:
 *  - view mode: checkbox, title/description/due date, Edit & Delete buttons.
 *  - edit mode: inline form to change title, description and due date.
 */
export default function TaskItem({ task, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <EditRow
        task={task}
        onCancel={() => setEditing(false)}
        onSave={async (changes) => {
          await onUpdate(task.id, changes);
          setEditing(false);
        }}
      />
    );
  }

  const overdue = isOverdue(task);

  return (
    <li className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
      />

      <div className="min-w-0 flex-1">
        <p
          className={`break-words font-medium ${
            task.completed ? 'text-slate-400 line-through' : 'text-slate-900'
          }`}
        >
          {task.title}
        </p>

        {task.description && (
          <p className="mt-0.5 break-words text-sm text-slate-500">{task.description}</p>
        )}

        {task.dueDate && (
          <span
            className={`mt-1 inline-block text-xs font-medium ${
              overdue ? 'text-red-600' : 'text-slate-400'
            }`}
          >
            Due {formatDate(task.dueDate)}
            {overdue && ' · Overdue'}
          </span>
        )}
      </div>

      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-md px-2 py-1 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          className="rounded-md px-2 py-1 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

/** Inline edit form, kept local to this file. */
function EditRow({ task, onSave, onCancel }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.slice(0, 10) : '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    if (!title.trim()) {
      setError('Title cannot be empty.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || null,
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <li className="space-y-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-indigo-200">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Edit title"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        aria-label="Edit description"
        rows={2}
        placeholder="Description (optional)"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="Edit due date"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <div className="flex gap-2 sm:ml-auto">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </li>
  );
}
