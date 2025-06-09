import React from 'react'; 
import { useGlobalContext } from '../context/GlobalContext'; 
import {
    Checkbox
} from '@mantine/core'

function Visibility () {

    const {
        showFlightPaths, setShowFlightPaths,
        showConstellation, setShowConstellation,
        showGroundStations, setShowGroundStations,
    } = useGlobalContext(); 

    return (
        <>
            <Checkbox
                label="Show constellation"
                onChange={(e) => setShowConstellation(e.currentTarget.checked)}
            />
            <Checkbox
                label="Show flight paths"
                onChange={(e) => setShowFlightPaths(e.currentTarget.checked)}
            />
            <Checkbox
                label="Show ground stations"
                onChange={(e) => setShowGroundStations(e.currentTarget.checked)}
            />
        </>
    ); 
}; 
export default Visibility