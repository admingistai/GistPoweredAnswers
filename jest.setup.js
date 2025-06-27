import '@testing-library/jest-dom';

// Suppress JSDOM warnings
const originalError = console.error;
console.error = (...args) => {
  if (args[0]?.includes('Not implemented: navigation')) {
    return;
  }
  originalError.apply(console, args);
};

// Mock fetch for tests
global.fetch = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  fetch.mockClear();
});