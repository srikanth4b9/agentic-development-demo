import { EmptyState } from './components/ui';

export function App() {
  return (
    <main className="app-shell stack">
      <header className="row row--between">
        <h1 className="page-title">Support Requests</h1>
      </header>
      <EmptyState
        title="Support Request Dashboard is not built yet"
        description="This is the starting point for the live demo. See docs/requirements/support-request-dashboard.md."
      />
    </main>
  );
}
