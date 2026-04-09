import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <motion.button 
      className="theme-toggle" 
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {darkMode ? (
        <>
          <Sun size={20} />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <Moon size={20} />
          <span>Dark Mode</span>
        </>
      )}
    </motion.button>
  );
};

export default ThemeToggle;
