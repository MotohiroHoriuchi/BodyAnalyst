import { afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';

// Setup localStorage mock for tests
beforeAll(() => {
  // jsdom provides localStorage, but we ensure it's available
  if (typeof window !== 'undefined' && !window.localStorage) {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => {
          return (window as any).__localStorage?.[key] || null;
        },
        setItem: (key: string, value: string) => {
          if (!(window as any).__localStorage) {
            (window as any).__localStorage = {};
          }
          (window as any).__localStorage[key] = value;
        },
        removeItem: (key: string) => {
          if ((window as any).__localStorage) {
            delete (window as any).__localStorage[key];
          }
        },
        clear: () => {
          (window as any).__localStorage = {};
        },
      },
      writable: true,
    });
  }
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  // Clear localStorage after each test
  if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.clear === 'function') {
    window.localStorage.clear();
  }
});
