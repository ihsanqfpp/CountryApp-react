import { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchForm = ({ onSearch, loading }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(input);
  };

  return (
    <motion.form 
      className="search-box" 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="search-input-wrapper">
        <Search className="search-icon" size={20} />
        <input 
          type="text" 
          placeholder="Search for a country..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
      </div>
      <motion.button 
        type="submit" 
        disabled={loading || !input.trim()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? "Searching..." : "Explore"}
      </motion.button>
    </motion.form>
  );
};

export default SearchForm;
