import React from 'react'; 
import { useGlobalContext } from '../context/GlobalContext'; 
import {
    Checkbox, 
    Button
} from '@mantine/core'

function Visibility () {

    const {
        showSatellites, setShowSatellites,
        showSatelliteMesh, setShowSatelliteMesh,
        showFlightPaths, setShowFlightPaths,
        showGroundStations, setShowGroundStations,
        showGroundStationLabels, setShowGroundStationLabels,
        showGroundStationConnections, setShowGroundStationConnections,
        mapProjection, setMapProjection
    } = useGlobalContext(); 

    return (
        <>
            <Checkbox
                label="Show satellites"
                checked={showSatellites}
                onChange={(e) => setShowSatellites(e.currentTarget.checked)}
            />
            <Checkbox
                label="Show satellite laser mesh"
                checked={showSatelliteMesh}
                onChange={(e) => setShowSatelliteMesh(e.currentTarget.checked)}
            />
            <Checkbox
                label="Show flight paths"
                checked={showFlightPaths}
                onChange={(e) => setShowFlightPaths(e.currentTarget.checked)}
            />
            <Checkbox
                label="Show ground stations"
                checked={showGroundStations}
                onChange={(e) => setShowGroundStations(e.currentTarget.checked)}
            />
             <Checkbox
                label="Show ground station labels"
                checked={showGroundStationLabels}
                onChange={(e) => setShowGroundStationLabels(e.currentTarget.checked)}
            />
            <Checkbox
                label="Show ground station connections"
                checked={showGroundStationConnections}
                onChange={(e) => setShowGroundStationConnections(e.currentTarget.checked)}
            />
            <Button
                variant='light'
                color='#fff'
                onClick={() => setMapProjection(mapProjection === "mercator" ? "globe" : "mercator")}
            > 
                {mapProjection === "mercator" ? "Switch to 3D" : "Switch to 2D"}
            </Button>
        </>
    ); 
}; 
export default Visibility