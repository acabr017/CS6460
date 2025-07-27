import React, { createContext, useState, useEffect } from 'react';
import AxiosInstance from './axios';

export const SchoolYearContext = createContext();

export const SchoolYearProvider = ({ children }) => {
  const [schoolYears, setSchoolYears] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchoolYears = async () => {
    try {
      const response = await AxiosInstance.get('schoolyear/');
      setSchoolYears(response.data);
    } catch (error) {
      console.error('Error fetching school years:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchoolYears();
  }, []);

  return (
    <SchoolYearContext.Provider value={{ schoolYears, fetchSchoolYears, loading }}>
      {children}
    </SchoolYearContext.Provider>
  );
};