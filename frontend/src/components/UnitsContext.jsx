import { createContext, useState, useEffect } from 'react';
import AxiosInstance from './axios';

export const UnitContext = createContext();

export const UnitProvider = ({ children }) => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUnits = async () => {
    try {
      const response = await AxiosInstance.get('/unit/');
      setUnits(response.data);
    } catch (error) {
      console.error('Failed to fetch units:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  return (
    <UnitContext.Provider value={{ units, fetchUnits, loading }}>
      {children}
    </UnitContext.Provider>
  );
};