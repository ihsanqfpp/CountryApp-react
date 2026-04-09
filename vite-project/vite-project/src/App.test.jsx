import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

// Mock Country so we don't have to deal with all its dependencies in the App test
vi.mock('./Country', () => {
  return {
    default: () => <div data-testid="mock-country">Country</div>,
  };
});

// Need to mock matchMedia if it's not present in jsdom
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('App Component', () => {
  it('renders without crashing and includes Country component', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('mock-country')).toBeInTheDocument();
  });
});
