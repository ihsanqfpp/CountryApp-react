import axios from 'axios';

const COUNTRIES_JSON_URL = 'https://cdn.jsdelivr.net/gh/mledoze/countries@master/countries.json';

let cachedCountries = null;

const isTest = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test';

const fetchAllCountries = async () => {
  if (cachedCountries && !isTest) return cachedCountries;
  const response = await axios.get(COUNTRIES_JSON_URL);
  
  cachedCountries = response.data.map(country => {
    if (country && country.flags) {
      return country;
    }
    const cca2 = country.cca2 ? country.cca2.toLowerCase() : '';
    return {
      ...country,
      flags: {
        png: country.flags?.png || (cca2 ? `https://flagcdn.com/w320/${cca2}.png` : ''),
        svg: country.flags?.svg || (cca2 ? `https://flagcdn.com/w2560/${cca2}.svg` : ''),
      }
    };
  });
  return cachedCountries;
};

export const fetchCountryByName = async (name) => {
  try {
    const countries = await fetchAllCountries();
    const query = name.toLowerCase().trim();
    
    const matches = countries.filter(country => {
      const commonName = (country.name?.common || '').toLowerCase();
      const officialName = (country.name?.official || '').toLowerCase();
      const altMatch = country.altSpellings && country.altSpellings.some(alt => alt.toLowerCase().includes(query));
      
      return commonName.includes(query) || officialName.includes(query) || altMatch;
    });

    if (matches.length === 0) {
      const err = new Error("Country not found. Please try again.");
      err.response = { status: 404 };
      throw err;
    }
    
    return matches;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Country not found. Please try again.");
    }
    throw new Error("An error occurred while fetching data.");
  }
};
