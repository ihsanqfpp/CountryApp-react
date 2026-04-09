import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CountryDetails from './CountryDetails';

// framer-motion is auto-mocked via /__mocks__/framer-motion.jsx

// ── Fixtures ──────────────────────────────────────────────────────────────────
const mockData = {
  name: 'French Republic',
  flag: 'https://example.com/france.png',
  population: 67391582,
  region: 'Europe',
  capital: 'Paris',
  currency: 'Euro',
  language: 'French',
  callingCode: '+33',
};

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('CountryDetails', () => {
  it('renders nothing when data is null', () => {
    const { container } = render(<CountryDetails data={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the country name', () => {
    render(<CountryDetails data={mockData} />);
    expect(screen.getByText('French Republic')).toBeInTheDocument();
  });

  it('renders the flag image with correct alt text', () => {
    render(<CountryDetails data={mockData} />);
    const flag = screen.getByAltText('Flag of French Republic');
    expect(flag).toBeInTheDocument();
    expect(flag).toHaveAttribute('src', 'https://example.com/france.png');
  });

  it('displays all stat labels', () => {
    render(<CountryDetails data={mockData} />);
    expect(screen.getByText(/capital/i)).toBeInTheDocument();
    expect(screen.getByText(/region/i)).toBeInTheDocument();
    expect(screen.getByText(/population/i)).toBeInTheDocument();
    expect(screen.getByText(/currency/i)).toBeInTheDocument();
    expect(screen.getByText(/language/i)).toBeInTheDocument();
    expect(screen.getByText(/calling code/i)).toBeInTheDocument();
  });

  it('displays the correct values for each stat', () => {
    render(<CountryDetails data={mockData} />);
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Europe')).toBeInTheDocument();
    expect(screen.getByText('67,391,582')).toBeInTheDocument();
    expect(screen.getByText('Euro')).toBeInTheDocument();
    expect(screen.getByText('French')).toBeInTheDocument();
    expect(screen.getByText('+33')).toBeInTheDocument();
  });
});
