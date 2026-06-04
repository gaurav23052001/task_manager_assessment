// Thin wrapper around fetch for the task API. In development the Vite proxy
// forwards /api to the backend; in production set VITE_API_BASE_URL to the
// deployed backend origin.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    // Network failure (server down, no connection, etc.)
    throw new Error('Could not reach the server. Is the backend running?');
  }

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Request failed.');
  }
  return data;
}

export const tasksApi = {
  list({ status = 'all', search = '' } = {}) {
    const params = new URLSearchParams({ status });
    if (search) params.set('search', search);
    return request(`/api/tasks?${params.toString()}`);
  },

  create(task) {
    return request('/api/tasks', { method: 'POST', body: JSON.stringify(task) });
  },

  update(id, changes) {
    return request(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(changes),
    });
  },

  remove(id) {
    return request(`/api/tasks/${id}`, { method: 'DELETE' });
  },
};
