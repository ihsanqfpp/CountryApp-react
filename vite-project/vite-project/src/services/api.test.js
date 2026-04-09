import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { fetchCountryByName } from './api';

// Mock the entire axios module
vi.mock('axios');

// ── Fixtures ─────────────────────────────────────────────────────────────────
const mockCountry = {
  name: { official: 'French Republic', common: 'France' },
  flags: { png: 'https://example.com/france.png' },
  population: 67391582,
  region: 'Europe',
  capital: ['Paris'],
  currencies: { EUR: { name: 'Euro' } },
  languages: { fra: 'French' },
  idd: { root: '+3', suffixes: ['3'] },
};

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('fetchCountryByName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns data array on a successful API call', async () => {
    axios.get.mockResolvedValueOnce({ data: [mockCountry] });

    const result = await fetchCountryByName('France');
    expect(result).toEqual([mockCountry]);
    expect(axios.get).toHaveBeenCalledWith(
      'https://restcountries.com/v3.1/name/France'
    );
  });

  it('throws a user-friendly error when the API returns 404', async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 404 } });

    await expect(fetchCountryByName('InvalidXYZ')).rejects.toThrow(
      'Country not found. Please try again.'
    );
  });

  it('throws a generic error for non-404 failures', async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 500 } });

    await expect(fetchCountryByName('France')).rejects.toThrow(
      'An error occurred while fetching data.'
    );
  });

  it('calls the API with the correct URL', async () => {
    axios.get.mockResolvedValueOnce({ data: [mockCountry] });
    await fetchCountryByName('Japan');
    expect(axios.get).toHaveBeenCalledWith(
      'https://restcountries.com/v3.1/name/Japan'
    );
  });
});
