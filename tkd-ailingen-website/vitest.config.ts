import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src/app'),
      '@core': path.resolve(__dirname, './src/app/core'),
      '@shared': path.resolve(__dirname, './src/app/shared'),
      '@environments': path.resolve(__dirname, './src/environments'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
