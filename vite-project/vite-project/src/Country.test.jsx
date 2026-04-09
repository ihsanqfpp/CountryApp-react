import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Country from './Country';
import * as useCountryModule from './hooks/useCountry';
import { ThemeProvider } from './context/ThemeContext';

// Mock the hook
vi.mock('./hooks/useCountry', () => ({
  useCountry: vi.fn(),
}));

// Provide intersectionObserver mock for framer-motion if needed
beforeAll(() => {
  class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.IntersectionObserver = IntersectionObserver;
});

const renderWithTheme = (ui) => render(
  <ThemeProvider>
    {ui}
  </ThemeProvider>
);

describe('Country Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state when loading is true', () => {
    useCountryModule.useCountry.mockReturnValue({
      data: null,
      results: [],
      error: null,
      loading: true,
      background: '',
      searchCountry: vi.fn(),
      selectCountry: vi.fn(),
    });

    const { container } = renderWithTheme(<Country />);
    expect(screen.getByText(/Global Explorer/i)).toBeInTheDocument();
    
    // Check for loader (which has 'loading-skeleton' class)
    const loader = container.querySelector('.loading-skeleton');
    expect(loader).toBeInTheDocument();
  });

  it('renders error state when error is present', () => {
    useCountryModule.useCountry.mockReturnValue({
      data: null,
      results: [],
      error: 'Not found',
      loading: false,
      background: '',
      searchCountry: vi.fn(),
      selectCountry: vi.fn(),
    });

    renderWithTheme(<Country />);
    expect(screen.getByText(/No country found/i)).toBeInTheDocument();
  });

  it('renders CountryList when results has items', () => {
    useCountryModule.useCountry.mockReturnValue({
      data: null,
      results: [{ name: { common: 'Canada' }, cca3: 'CAN' }],
      error: null,
      loading: false,
      background: '',
      searchCountry: vi.fn(),
      selectCountry: vi.fn(),
    });

    renderWithTheme(<Country />);
    // Look for a part of CountryList rendering or text 'Canada'
    expect(screen.getByText(/Canada/i)).toBeInTheDocument();
  });

  it('renders CountryDetails when data is present but results empty', () => {
    useCountryModule.useCountry.mockReturnValue({
      data: {
        name: 'Japan',
        flag: 'url-to-flag.svg',
        capital: 'Tokyo',
        population: 125000000,
        region: 'Asia',
        currency: 'Japanese Yen',
        language: 'Japanese',
        callingCode: '+81'
      },
      results: [],
      error: null,
      loading: false,
      background: '',
      searchCountry: vi.fn(),
      selectCountry: vi.fn(),
    });

    renderWithTheme(<Country />);
    // Verify it rendered the CountryDetails (like Capital: Tokyo)
    expect(screen.getByText(/Tokyo/i)).toBeInTheDocument();
  });
});
