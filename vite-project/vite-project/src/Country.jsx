import { useCountry } from './hooks/useCountry';
import { useTheme } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import SearchForm from './components/SearchForm';
import CountryDetails from './components/CountryDetails';
import CountryList from './components/CountryList';
import Loader from './components/Loader';
import { motion, AnimatePresence } from 'framer-motion';

function Country() {
  const { data, results, error, loading, background, searchCountry, selectCountry } = useCountry();
  const { darkMode } = useTheme();

  return (
    <div className={`app-wrapper ${darkMode ? "dark-mode" : ""}`}>
      {/* Luxury Immersive Background Layer */}
      <div 
        className="bg-immersive" 
        style={{ 
          backgroundImage: background ? `url(${background})` : 'none',
          display: background ? 'block' : 'none' 
        }} 
      />
      
      <div className="container">
        <ThemeToggle />

        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, scale: 0.98, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <header>
            <h1 className="title">Global Explorer</h1>
          </header>

          <SearchForm onSearch={searchCountry} loading={loading} />

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                className="error-msg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <span className="error-icon">🔍</span>
                <div className="error-text">
                  <strong>No country found</strong>
                  <p>Check the spelling or try a broader name like "America" or "United".</p>
                </div>
              </motion.div>
            )}
            
            {loading ? (
              <Loader key="loader" />
            ) : (
              <div className="results-wrapper">
                {results.length > 0 ? (
                  <CountryList key="results" results={results} onSelect={selectCountry} />
                ) : (
                  <CountryDetails key="details" data={data} />
                )}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default Country;
