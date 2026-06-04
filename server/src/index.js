import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createApp } from './app.js';
import { createTaskStore } from './store.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 4000;
const DATA_FILE = process.env.DATA_FILE || join(__dirname, '..', 'data', 'tasks.json');

const store = createTaskStore(DATA_FILE);
const app = createApp(store);

app.listen(PORT, () => {
  console.log(`Task Manager API listening on http://localhost:${PORT}`);
});
