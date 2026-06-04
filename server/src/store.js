import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';


export function createTaskStore(filePath) {
  let tasks = load(filePath);

  function persist() {
    writeFileSync(filePath, JSON.stringify(tasks, null, 2));
  }

  return {
    /** Return all tasks, newest first. */
    list() {
      return [...tasks].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    },

    find(id) {
      return tasks.find((task) => task.id === id) ?? null;
    },

    create({ title, description = '', dueDate = null }) {
      const now = new Date().toISOString();
      const task = {
        id: randomUUID(),
        title,
        description,
        dueDate,
        completed: false,
        createdAt: now,
        updatedAt: now,
      };
      tasks.push(task);
      persist();
      return task;
    },

    update(id, changes) {
      const task = tasks.find((t) => t.id === id);
      if (!task) return null;

      Object.assign(task, changes, { updatedAt: new Date().toISOString() });
      persist();
      return task;
    },

    remove(id) {
      const before = tasks.length;
      tasks = tasks.filter((task) => task.id !== id);
      const removed = tasks.length < before;
      if (removed) persist();
      return removed;
    },
  };
}

function load(filePath) {
  try {
    if (!existsSync(filePath)) {
      mkdirSync(dirname(filePath), { recursive: true });
      writeFileSync(filePath, '[]');
      return [];
    }
    const raw = readFileSync(filePath, 'utf-8').trim();
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error(`Could not read tasks from ${filePath}:`, err.message);
    return [];
  }
}
