import cors from 'cors';
import express from 'express';
import { createTaskRouter } from './routes/tasks.js';


export function createApp(store) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api/tasks', createTaskRouter(store));

  // 404 for unknown routes
  app.use((_req, res) => res.status(404).json({ error: 'Not found.' }));

  // Centralised error handler (e.g. malformed JSON bodies)
  app.use((err, _req, res, _next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Invalid JSON body.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  });

  return app;
}
