import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

  const [useDefaultConstellation, setUseDefaultConstellation] = useState(null); 
  const [uploadedFlightGeoJson, setUploadedFlightGeoJson] = useState(null); 
  const [customTleData, setCustomTleData] = useState(null); 
  const [beamwidth, setBeamwidth] = useState(20); 
  const [altitude, setAltitude] = useState(150); 
  const [enableDispersions, setEnableDispersions] = useState(false); 

  // VISIBILITY CONTEXT
  const [showSatellites, setShowSatellites] = useState(false); 
  const [showGroundStations, setShowGroundStations] = useState(false); 
  const [showFlightPaths, setShowFlightPaths] = useState(true); 
  const [showCircuits, setShowCircuits] = useState(false); 
  const [showGroundStationLabels, setShowGroundStationLabels] = useState(false);
  const [mapProjection, setMapProjection] = useState('globe'); 

  return (
    <GlobalContext.Provider value={{ 

        useDefaultConstellation, setUseDefaultConstellation, 
        uploadedFlightGeoJson, setUploadedFlightGeoJson, 
        customTleData, setCustomTleData, 
        beamwidth, setBeamwidth, 
        altitude, setAltitude,
        enableDispersions, setEnableDispersions,

        showSatellites, setShowSatellites,
        showGroundStations, setShowGroundStations,
        showFlightPaths, setShowFlightPaths,
        showCircuits, setShowCircuits,
        showGroundStationLabels, setShowGroundStationLabels,
        mapProjection, setMapProjection
        
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
