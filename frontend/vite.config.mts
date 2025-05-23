/// <reference types="vitest" />

import angular from '@analogjs/vite-plugin-angular';

import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      angular(),

    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['default'],
      coverage: {
        provider: 'istanbul',
        reporter: ['text', 'json', 'html'],
        reportsDirectory: './coverage',
        exclude: [
          'node_modules/',
          'src/test-setup.ts',
          '**/*.spec.ts',
          '**/*.d.ts',
          '**/*.config.ts',
          '**/index.ts',
          '**/main.ts',
        ],
        thresholds: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        }
      },
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
