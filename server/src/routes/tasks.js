import { Router } from 'express';
import { validateCreate, validateUpdate } from '../validation.js';


export function createTaskRouter(store) {
  const router = Router();

  // GET /api/tasks?status=all|active|completed&search=term
  router.get('/', (req, res) => {
    const { status = 'all', search = '' } = req.query;
    let tasks = store.list();

    if (status === 'active') {
      tasks = tasks.filter((task) => !task.completed);
    } else if (status === 'completed') {
      tasks = tasks.filter((task) => task.completed);
    }

    const term = String(search).trim().toLowerCase();
    if (term) {
      tasks = tasks.filter((task) => task.title.toLowerCase().includes(term));
    }

    res.json(tasks);
  });

  // POST /api/tasks
  router.post('/', (req, res) => {
    const { value, error } = validateCreate(req.body);
    if (error) return res.status(400).json({ error });

    const task = store.create(value);
    res.status(201).json(task);
  });

  // PATCH /api/tasks/:id  (partial update: edit fields or toggle completed)
  router.patch('/:id', (req, res) => {
    const { value, error } = validateUpdate(req.body);
    if (error) return res.status(400).json({ error });

    const task = store.update(req.params.id, value);
    if (!task) return res.status(404).json({ error: 'Task not found.' });

    res.json(task);
  });

  // DELETE /api/tasks/:id
  router.delete('/:id', (req, res) => {
    const removed = store.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Task not found.' });

    res.status(204).end();
  });

  return router;
}
