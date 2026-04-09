import { motion, AnimatePresence } from 'framer-motion';
import { Users, MapPin, Landmark, Coins, Languages, Phone } from 'lucide-react';

const CountryDetails = ({ data }) => {
  if (!data) return null;

  const stats = [
    { label: "Capital", value: data.capital, icon: <Landmark size={18} /> },
    { label: "Region", value: data.region, icon: <MapPin size={18} /> },
    { label: "Population", value: data.population.toLocaleString(), icon: <Users size={18} /> },
    { label: "Currency", value: data.currency, icon: <Coins size={18} /> },
    { label: "Language", value: data.language, icon: <Languages size={18} /> },
    { label: "Calling Code", value: data.callingCode, icon: <Phone size={18} /> },
  ];

  return (
    <motion.div 
      className="country-info"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div 
        className="flag-container"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <img src={data.flag} alt={`Flag of ${data.name}`} className="flag-image" />
      </motion.div>

      <div className="country-header">
        <h2 className="country-name">{data.name}</h2>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div 
            key={stat.label}
            className="stat-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
          >
            <div className="stat-label">
              {stat.icon}
              <span>{stat.label}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CountryDetails;
