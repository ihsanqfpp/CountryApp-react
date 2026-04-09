import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CountryList from './CountryList';

// framer-motion is auto-mocked via /__mocks__/framer-motion.jsx

// ── Fixtures ──────────────────────────────────────────────────────────────────
const mockResults = [
  {
    cca3: 'USA',
    name: { common: 'United States', official: 'United States of America' },
    flags: { png: 'https://example.com/us.png' },
    region: 'Americas',
  },
  {
    cca3: 'GBR',
    name: { common: 'United Kingdom', official: 'United Kingdom' },
    flags: { png: 'https://example.com/uk.png' },
    region: 'Europe',
  },
  {
    cca3: 'ARE',
    name: { common: 'United Arab Emirates', official: 'United Arab Emirates' },
    flags: { png: 'https://example.com/uae.png' },
    region: 'Asia',
  },
];

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('CountryList', () => {
  it('renders nothing when results array is empty', () => {
    const { container } = render(<CountryList results={[]} onSelect={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the correct match count message', () => {
    render(<CountryList results={mockResults} onSelect={vi.fn()} />);
    expect(screen.getByText(/Found 3 matches/i)).toBeInTheDocument();
  });

  it('renders a list item for each result', () => {
    render(<CountryList results={mockResults} onSelect={vi.fn()} />);
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
    expect(screen.getByText('United Arab Emirates')).toBeInTheDocument();
  });

  it('renders the region for each country', () => {
    render(<CountryList results={mockResults} onSelect={vi.fn()} />);
    expect(screen.getByText('Americas')).toBeInTheDocument();
    expect(screen.getByText('Europe')).toBeInTheDocument();
    expect(screen.getByText('Asia')).toBeInTheDocument();
  });

  it('calls onSelect with the correct country when a list item is clicked', () => {
    const onSelect = vi.fn();
    render(<CountryList results={mockResults} onSelect={onSelect} />);

    // Click on "United Kingdom" item
    fireEvent.click(screen.getByText('United Kingdom'));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(mockResults[1]);
  });

  it('calls onSelect with the first item when the first item is clicked', () => {
    const onSelect = vi.fn();
    render(<CountryList results={mockResults} onSelect={onSelect} />);

    fireEvent.click(screen.getByText('United States'));
    expect(onSelect).toHaveBeenCalledWith(mockResults[0]);
  });

  it('renders flag images with correct src and alt attributes', () => {
    render(<CountryList results={mockResults} onSelect={vi.fn()} />);
    const ukFlag = screen.getByAltText('United Kingdom');
    expect(ukFlag).toHaveAttribute('src', 'https://example.com/uk.png');
  });
});
