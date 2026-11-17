// Switch the running mock API between normal | slow | error | empty, or reset its data.
// Usage: node scripts/mock-mode.mjs <normal|slow|error|empty|reset>
const arg = process.argv[2];
const port = process.env.API_PORT ?? 4000;
const base = `http://localhost:${port}/api`;

try {
  const res =
    arg === 'reset'
      ? await fetch(`${base}/__reset`, { method: 'POST' })
      : await fetch(`${base}/__mock`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: arg }),
        });
  console.log(res.status, await res.text());
  process.exit(res.ok ? 0 : 1);
} catch {
  console.error(`Mock API is not running on port ${port}. Start it with "npm run dev".`);
  process.exit(1);
}
