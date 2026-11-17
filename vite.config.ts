import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const API_PORT = Number(process.env.API_PORT ?? 4000);
const WEB_PORT = Number(process.env.WEB_PORT ?? 5173);

export default defineConfig({
  plugins: [react()],
  server: {
    port: WEB_PORT,
    strictPort: true,
    proxy: {
      '/api': `http://localhost:${API_PORT}`,
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
});
