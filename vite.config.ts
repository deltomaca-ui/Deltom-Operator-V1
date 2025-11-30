import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Force watch
    watch: {
      usePolling: true,
    }
  },
  build: {
    outDir: 'dist',
  },
  // Cache Buster Timestamp: 2025-11-29-REFRESH-CACHE
});