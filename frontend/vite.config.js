import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the AI StudyMate frontend.
export default defineConfig({
  plugins: [react()],
  server: {
    // Listen on all addresses so both http://localhost:5173 and
    // http://127.0.0.1:5173 work during development.
    host: true,
    port: 5173,
  },
});