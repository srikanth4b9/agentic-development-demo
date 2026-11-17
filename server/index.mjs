// Mock Support Request API (in-memory). Demo use only.
import express from 'express';
import { createSeed } from './seed.mjs';

const PORT = Number(process.env.API_PORT ?? 4000);
const STATUSES = ['open', 'in_progress', 'resolved'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const MODES = ['normal', 'slow', 'error', 'empty'];

let requests = createSeed();
let nextId = 1001 + requests.length;
let mode = 'normal';

const app = express();
app.use(express.json({ limit: '16kb' }));

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const latency = () => (mode === 'slow' ? 2500 : 300);

function sendError(res, status, code, message, fieldErrors) {
  res.status(status).json({ error: { code, message, ...(fieldErrors ? { fieldErrors } : {}) } });
}

function stats(items) {
  return {
    total: items.length,
    open: items.filter((r) => r.status !== 'resolved').length,
    resolved: items.filter((r) => r.status === 'resolved').length,
  };
}

app.get('/api/health', (_req, res) => res.json({ ok: true, mode }));

// GET /api/requests?search=&status=open|in_progress|resolved|all
app.get('/api/requests', async (req, res) => {
  await delay(latency());
  if (mode === 'error') {
    return sendError(res, 500, 'internal_error', 'The support service is unavailable.');
  }
  if (mode === 'empty') return res.json({ items: [], stats: stats([]) });

  const search = String(req.query.search ?? '')
    .trim()
    .toLowerCase();
  const status = String(req.query.status ?? 'all');
  if (status !== 'all' && !STATUSES.includes(status)) {
    return sendError(res, 400, 'invalid_status', `Unknown status "${status}".`);
  }

  const items = requests
    .filter((r) => status === 'all' || r.status === status)
    .filter(
      (r) =>
        !search || r.title.toLowerCase().includes(search) || r.id.toLowerCase().includes(search),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  // Stats always describe the whole dataset, independent of the active filters.
  res.json({ items, stats: stats(requests) });
});

// POST /api/requests  { title, description, priority }
app.post('/api/requests', async (req, res) => {
  await delay(latency());
  if (mode === 'error') {
    return sendError(res, 500, 'internal_error', 'The support service is unavailable.');
  }

  const { title, description, priority } = req.body ?? {};
  const fieldErrors = {};
  const t = typeof title === 'string' ? title.trim() : '';
  const d = typeof description === 'string' ? description.trim() : '';
  if (t.length < 5 || t.length > 120) {
    fieldErrors.title = 'Title must be between 5 and 120 characters.';
  }
  if (d.length < 10 || d.length > 2000) {
    fieldErrors.description = 'Description must be between 10 and 2000 characters.';
  }
  if (!PRIORITIES.includes(priority)) fieldErrors.priority = 'Choose a valid priority.';
  if (Object.keys(fieldErrors).length) {
    return sendError(
      res,
      400,
      'validation_error',
      'Please fix the highlighted fields.',
      fieldErrors,
    );
  }

  const created = {
    id: `REQ-${nextId++}`,
    title: t,
    description: d,
    priority,
    status: 'open',
    requester: 'Demo User',
    createdAt: new Date().toISOString(),
  };
  requests.push(created);
  res.status(201).json(created);
});

// --- Demo / test controls ----------------------------------------------------
app.post('/api/__mock', (req, res) => {
  const next = req.body?.mode;
  if (!MODES.includes(next)) {
    return sendError(res, 400, 'invalid_mode', `Mode must be one of: ${MODES.join(', ')}.`);
  }
  mode = next;
  res.json({ mode });
});

app.post('/api/__reset', (_req, res) => {
  requests = createSeed();
  nextId = 1001 + requests.length;
  mode = 'normal';
  res.json({ ok: true });
});

app.use('/api', (_req, res) => sendError(res, 404, 'not_found', 'Endpoint not found.'));

app.listen(PORT, () => {
  console.log(`Mock Support API on http://localhost:${PORT} (mode: ${mode})`);
});
