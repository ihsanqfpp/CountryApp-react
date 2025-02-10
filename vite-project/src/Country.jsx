import { useState } from "react";
import axios from "axios";


function Country() {
  const [input, setInput] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [background, setBackground] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  async function getData() {
    if (!input.trim()) {
      setError("Please enter a country name.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/name/${input}`);
      const country = response.data[0];

      setData({
        name: country.name.official,
        flag: country.flags.png,
        population: country.population,
        region: country.region,
        capital: country.capital ? country.capital[0] : "N/A",
        currency: country.currencies ? Object.values(country.currencies)[0].name : "N/A",
        language: country.languages ? Object.values(country.languages).join(", ") : "N/A",
        callingCode: country.idd?.root ? country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : "") : "N/A",
      });

      // Set full-page background to the country's flag
      setBackground(country.flags?.png || "");
      setError(null);
    } catch (err) {
      setError("Country not found. Please try again.");
      setData(null);
      setBackground("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`container ${darkMode ? "dark-mode" : ""}`} style={{ backgroundImage: `url(${background})` }}>
      <div className="overlay">
        <h1 className="title">🌍 Country Information 🌎</h1>

        {/* Dark Mode Toggle */}
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <div className="search-box">
          <input 
            type="text" 
            placeholder="Enter country name" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getData()}
          />
          <button onClick={getData} disabled={loading}>
            {loading ? "Loading..." : "Get Data"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}
        
        {/* Skeleton Loader While Fetching */}
        {loading && <div className="loading-skeleton"></div>}

        {data && !loading && (
  <div className="country-info fade-in">
    <img src={data.flag} alt={`Flag of ${data.name}`} className="flag-image" />
    <h2>{data.name}</h2>
    <p><strong>Capital:</strong> {data.capital}</p>
    <p><strong>Region:</strong> {data.region}</p>
    <p><strong>Population:</strong> {data.population.toLocaleString()}</p>
    <p><strong>Currency:</strong> {data.currency}</p>
    <p><strong>Language(s):</strong> {data.language}</p>
    <p><strong>Calling Code:</strong> {data.callingCode}</p>
  </div>
        )}
      </div>
    </div>
  );
}

export default Country;
