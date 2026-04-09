import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCountry } from './useCountry';
import * as apiModule from '../services/api';

// Mock the API service so we don't make real network calls
vi.mock('../services/api');

// ── Fixtures ──────────────────────────────────────────────────────────────────
const mockRawCountry = {
  name: { official: 'French Republic', common: 'France' },
  flags: { png: 'https://example.com/france.png' },
  population: 67391582,
  region: 'Europe',
  capital: ['Paris'],
  currencies: { EUR: { name: 'Euro' } },
  languages: { fra: 'French' },
  idd: { root: '+3', suffixes: ['3'] },
  cca3: 'FRA',
};

const mockRawUk = {
  name: { official: 'United Kingdom', common: 'United Kingdom' },
  flags: { png: 'https://example.com/uk.png' },
  population: 67215293,
  region: 'Europe',
  capital: ['London'],
  currencies: { GBP: { name: 'British pound' } },
  languages: { eng: 'English' },
  idd: { root: '+4', suffixes: ['4'] },
  cca3: 'GBR',
};

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('useCountry hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts with empty / clean initial state', () => {
    const { result } = renderHook(() => useCountry());
    expect(result.current.data).toBeNull();
    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.background).toBe('');
  });

  it('sets error when called with an empty string', async () => {
    const { result } = renderHook(() => useCountry());
    act(() => { result.current.searchCountry(''); });
    expect(result.current.error).toBe('Please enter a country name.');
  });

  it('shows data directly when API returns exactly 1 result', async () => {
    apiModule.fetchCountryByName.mockResolvedValueOnce([mockRawCountry]);
    const { result } = renderHook(() => useCountry());

    await act(async () => {
      result.current.searchCountry('France');
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).not.toBeNull();
    expect(result.current.data.name).toBe('French Republic');
    expect(result.current.data.capital).toBe('Paris');
    expect(result.current.data.region).toBe('Europe');
    expect(result.current.data.currency).toBe('Euro');
    expect(result.current.data.language).toBe('French');
    expect(result.current.background).toBe('https://example.com/france.png');
    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('populates results array (not data) when API returns multiple matches', async () => {
    apiModule.fetchCountryByName.mockResolvedValueOnce([mockRawCountry, mockRawUk]);
    const { result } = renderHook(() => useCountry());

    await act(async () => {
      result.current.searchCountry('United');
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.results).toHaveLength(2);
    expect(result.current.data).toBeNull();
    expect(result.current.background).toBe('');
  });

  it('sets error and clears data when API throws', async () => {
    apiModule.fetchCountryByName.mockRejectedValueOnce(
      new Error('Country not found. Please try again.')
    );
    const { result } = renderHook(() => useCountry());

    await act(async () => {
      result.current.searchCountry('InvalidXYZ');
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Country not found. Please try again.');
    expect(result.current.data).toBeNull();
    expect(result.current.results).toEqual([]);
  });

  it('selectCountry transforms raw data and sets background', () => {
    const { result } = renderHook(() => useCountry());

    act(() => { result.current.selectCountry(mockRawUk); });

    expect(result.current.data.name).toBe('United Kingdom');
    expect(result.current.data.capital).toBe('London');
    expect(result.current.background).toBe('https://example.com/uk.png');
    expect(result.current.results).toEqual([]);
  });

  it('clears previous results before a new search', async () => {
    // First search returns multiple
    apiModule.fetchCountryByName.mockResolvedValueOnce([mockRawCountry, mockRawUk]);
    const { result } = renderHook(() => useCountry());

    await act(async () => { result.current.searchCountry('United'); });
    await waitFor(() => expect(result.current.results).toHaveLength(2));

    // Second search returns 1 — results should be cleared
    apiModule.fetchCountryByName.mockResolvedValueOnce([mockRawCountry]);
    await act(async () => { result.current.searchCountry('France'); });
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.results).toEqual([]);
    expect(result.current.data.name).toBe('French Republic');
  });
});
