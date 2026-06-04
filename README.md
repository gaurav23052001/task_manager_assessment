# Personal Task Manager

> Studio Graphene Full Stack assessment — **Exercise 1: Personal Task Manager**

A small full-stack to-do app for a single user. You can add tasks (with an
optional description and due date), view them newest-first, toggle them
complete, edit them inline, delete them with a confirmation prompt, filter by
status, and search by title. Active/completed counts are shown in the header,
overdue tasks are highlighted in red, and the app has loading, error, and empty
states. The React frontend talks to a Node/Express backend over a REST API, and
tasks are persisted to a JSON file so they survive server restarts.

## Live Demo

- **Frontend:** _add deployed link here (e.g. Vercel)_
- **Backend:** _add deployed link here (e.g. Render)_

> Not yet deployed. The app runs locally with the commands below. See
> [Deployment notes](#deployment-notes) for how to wire the two together.

## Tech Stack

| Layer    | Choice                          | Why                                                                 |
| -------- | ------------------------------- | ------------------------------------------------------------------- |
| Backend  | Node.js + **Express**           | Minimal, well-understood REST framework; fast to read and review.   |
| Frontend | **React 18** (via **Vite**)     | Functional components + hooks; Vite gives a fast dev server + build. |
| Storage  | **JSON file** (`fs`)            | No DB setup needed, human-readable, and persists across restarts.   |
| Styling  | **Tailwind CSS**                | Utility-first; quick to build a clean, responsive UI consistently.  |
| Tests    | **Vitest** + **Supertest**      | Lightweight; Supertest exercises the real Express app over HTTP.    |

JavaScript (ES modules) is used on both sides, per the brief's allowance.

## How to Run Locally

You need only **Node.js (v18+)** installed. The app has two parts — run each in
its own terminal.

**1. Backend** (serves the API on `http://localhost:4000`):

```bash
cd server
npm install
npm run dev      # or: npm start
```

**2. Frontend** (serves the UI on `http://localhost:5173`):

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173**. The Vite dev server proxies `/api` requests to
the backend on port 4000, so no extra configuration is needed.

**Run the backend tests:**

```bash
cd server
npm test
```

## API Documentation

Base URL: `http://localhost:4000`. All request/response bodies are JSON.

A **task** object has this shape:

```json
{
  "id": "a5a462c8-487e-4392-a5fc-208047c39a29",
  "title": "Ship assessment",
  "description": "",
  "dueDate": "2026-06-02",
  "completed": false,
  "createdAt": "2026-06-03T18:43:16.196Z",
  "updatedAt": "2026-06-03T18:43:16.196Z"
}
```

| Method   | Path              | Body                                                    | Response                          |
| -------- | ----------------- | ------------------------------------------------------- | --------------------------------- |
| `GET`    | `/api/tasks`      | —                                                       | `200` — array of tasks, newest first |
| `POST`   | `/api/tasks`      | `{ "title", "description?", "dueDate?" }`               | `201` — the created task          |
| `PATCH`  | `/api/tasks/:id`  | any of `{ "title", "description", "dueDate", "completed" }` | `200` — the updated task     |
| `DELETE` | `/api/tasks/:id`  | —                                                       | `204` — no content                |
| `GET`    | `/health`         | —                                                       | `200` — `{ "status": "ok" }`      |

**Query params on `GET /api/tasks`** (also used as a server-side option; the UI
filters client-side for snappiness):

- `status` — `all` (default) \| `active` \| `completed`
- `search` — case-insensitive title substring match

**Errors** are returned as `{ "error": "message" }`:

- `400` — validation failed (e.g. missing title, invalid date, negative-length fields, malformed JSON)
- `404` — task not found / unknown route

**Example:**

```bash
curl -X POST http://localhost:4000/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Buy milk","dueDate":"2026-06-10"}'
```

## Project Structure

```
.
├── client/                  # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── api.js           # fetch wrapper for the task API
│   │   ├── App.jsx          # top-level state, filtering, wiring
│   │   ├── components/      # TaskForm, TaskList, TaskItem, FilterBar, …
│   │   └── utils/date.js    # date formatting + overdue check
│   ├── vite.config.js       # dev server + /api proxy
│   └── tailwind.config.js
│
├── server/                  # Node + Express backend
│   ├── src/
│   │   ├── index.js         # bootstrap: wires store → app → port
│   │   ├── app.js           # Express app, middleware, error handling
│   │   ├── store.js         # JSON-file backed task store
│   │   ├── validation.js    # request body validation
│   │   └── routes/tasks.js  # /api/tasks route handlers
│   ├── tests/tasks.test.js  # API tests (Vitest + Supertest)
│   └── data/tasks.json      # persisted tasks (git-ignored, auto-created)
│
└── README.md
```

## What Works

- ✅ Add / view / edit / toggle / delete tasks (full CRUD)
- ✅ Tasks sorted newest-first; persisted to a JSON file across restarts
- ✅ Filter by All / Active / Completed; search by title
- ✅ Active vs completed counts in the header
- ✅ Overdue tasks visually flagged (past due date + not complete)
- ✅ Delete confirmation modal
- ✅ Loading skeleton, error banner, and empty-state UI
- ✅ Responsive layout (works on mobile widths)
- ✅ Input validation on both client and server
- ✅ 6 backend API tests passing

## Next Steps

Things I deliberately left out to keep within the time budget, and would do next:

- **Deployment** — wire the frontend to a deployed backend (set `VITE_API_BASE_URL`)
  and host on Vercel + Render. The code is ready for it; I just haven't pushed it live.
- **Drag-and-drop reordering** (a "nice to have"). The store currently sorts by
  creation date; supporting manual order would mean adding an `order` field.
- **Optimistic UI updates** — right now toggles/edits wait for the server round
  trip. For a snappier feel I'd update local state immediately and roll back on error.
- **Frontend tests** — I added backend API tests; component tests (React Testing
  Library) would be the next addition.
- **Debounced search** — search is instant against in-memory state, so it's not
  needed now, but it would matter if I switched to server-side search at scale.

## Deployment notes

The frontend reads the backend URL from `VITE_API_BASE_URL` (see
`client/.env.example`). Leave it empty for local dev (the Vite proxy handles it);
set it to the deployed backend origin in production. The backend port is
configurable via `PORT` and the data file via `DATA_FILE`.

