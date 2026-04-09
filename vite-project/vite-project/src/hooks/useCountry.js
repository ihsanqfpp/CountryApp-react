import { useState } from 'react';
import { fetchCountryByName } from '../services/api';

export const useCountry = () => {
  const [data, setData] = useState(null);
  const [results, setResults] = useState([]); // Array for multiple matches
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [background, setBackground] = useState("");

  const transformCountryData = (country) => {
    return {
      name: country.name?.official || "N/A",
      flag: country.flags?.png || "",
      population: country.population || 0,
      region: country.region || "N/A",
      capital: country.capital ? country.capital[0] : "N/A",
      currency: country.currencies ? Object.values(country.currencies)[0].name : "N/A",
      language: country.languages ? Object.values(country.languages).join(", ") : "N/A",
      callingCode: country.idd?.root ? country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : "") : "N/A",
    };
  };

  const selectCountry = (country) => {
    const transformed = transformCountryData(country);
    setData(transformed);
    setResults([]);
    setBackground(country.flags?.png || "");
    setError(null);
  };

  const searchCountry = async (countryName) => {
    if (!countryName.trim()) {
      setError("Please enter a country name.");
      setData(null);
      setResults([]);
      setBackground("");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);
    setResults([]);

    try {
      const rawData = await fetchCountryByName(countryName);
      
      if (rawData.length === 1) {
        // Only one match found, show it directly
        selectCountry(rawData[0]);
      } else {
        // Multiple matches found, set results for selection
        setResults(rawData);
        setData(null);
        setBackground("");
      }
    } catch (err) {
      setError(err.message || "Failed to load country data.");
      setData(null);
      setResults([]);
      setBackground("");
    } finally {
      setLoading(false);
    }
  };

  return { data, results, error, loading, background, searchCountry, selectCountry };
};
