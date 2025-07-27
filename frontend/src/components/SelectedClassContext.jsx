import { createContext, useContext, useState } from 'react';

const SelectedClassContext = createContext();

export const SelectedClassProvider = ({ children }) => {
  const [selectedClassId, setSelectedClassId] = useState(null);

  return (
    <SelectedClassContext.Provider value={{ selectedClassId, setSelectedClassId }}>
      {children}
    </SelectedClassContext.Provider>
  );
};

export const useSelectedClass = () => useContext(SelectedClassContext);