// Vitest setup for Angular tests

// Mock localStorage if not available
if (typeof localStorage === 'undefined') {
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null,
  } as Storage;
}

// Mock document.body if not available (for tests that manipulate DOM)
if (typeof document === 'undefined') {
  global.document = {
    body: {
      className: '',
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false,
      },
    },
  } as any;
}
