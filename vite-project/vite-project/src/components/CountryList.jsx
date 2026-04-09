import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const CountryList = ({ results, onSelect }) => {
  if (!results || results.length === 0) return null;

  return (
    <motion.div 
      className="country-results-container"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p className="results-count">Found {results.length} matches. Please select one:</p>
      <div className="results-scroll-area">
        {results.map((country, index) => (
          <motion.div 
            key={country.cca3 || index}
            className="country-list-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(country)}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            whileTap={{ scale: 0.98 }}
          >
            <img 
              src={country.flags?.png} 
              alt={country.name?.common} 
              className="list-flag"
            />
            <div className="list-info">
              <span className="list-name">{country.name?.common}</span>
              <span className="list-region">{country.region}</span>
            </div>
            <ChevronRight size={20} className="list-arrow" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CountryList;
