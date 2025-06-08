import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

  const [useDefaultConstellation, setUseDefaultConstellation] = useState(null); 
  const [uploadedFlightGeoJson, setUploadedFlightGeoJson] = useState(null); 
  const [customTleData, setCustomTleData] = useState(null); 
  const [beamwidth, setBeamwidth] = useState(20); 
  const [altitude, setAltitude] = useState(150); 
  const [enableDispersions, setEnableDispersions] = useState(false); 

  return (
    <GlobalContext.Provider value={{ 

        useDefaultConstellation, setUseDefaultConstellation, 
        uploadedFlightGeoJson, setUploadedFlightGeoJson, 
        customTleData, setCustomTleData, 
        beamwidth, setBeamwidth, 
        altitude, setAltitude,
        enableDispersions, setEnableDispersions
        
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
