import React, { useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl/mapbox';
import { useGlobalContext } from '../context/GlobalContext';

const FlightTrajectory = ({
  geojsonSource,
  heatmapConfig = {}
}) => {
  const { beamwidth, altitude, enableDispersions } = useGlobalContext();

  const [trajectoryGeoJson, setTrajectoryGeoJson] = useState({
    type: 'FeatureCollection',
    features: []
  });

  const [heatmapGeoJson, setHeatmapGeoJson] = useState({
    type: 'FeatureCollection',
    features: []
  });

  /**
   * Converts line-based GeoJSON to point-based GeoJSON with realistic signal dispersion modeling.
   */
  const generateHeatmapFromLines = (
    lineFeatureCollection,
    config = {
      altitudeKey: 'altitude_km',
      beamwidthKey: 'antenna_beamwidth_deg',
      defaultAltitude: altitude,
      defaultBeamwidth: beamwidth,
      weightCalculator: (beamwidth, altitude) => {
        if (!altitude || !beamwidth) return 0;

        const halfAngleRad = (beamwidth * Math.PI) / 360; // half beamwidth in radians
        const spreadRadius = altitude * Math.tan(halfAngleRad); // meters
        const area = Math.PI * Math.pow(spreadRadius, 2); // m²
        const powerDensity = 1 / area;

        return powerDensity;
      }
    }
  ) => {
    const heatmapPoints = [];

    for (const feature of lineFeatureCollection.features) {
      const properties = feature.properties || {};
      const coords = feature.geometry.coordinates;
      const altitudeArr = properties[config.altitudeKey] || [];
      const beamwidth = properties[config.beamwidthKey] ?? config.defaultBeamwidth;

      for (let i = 0; i < coords.length; i++) {
        const coord = coords[i];
        const alt = altitudeArr[i] ?? altitudeArr[0] ?? config.defaultAltitude;

        const weight = config.weightCalculator(beamwidth, alt || 1);

        heatmapPoints.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: coord },
          properties: {
            weight,
            altitude: alt
          }
        });
      }
    }

    return {
      type: 'FeatureCollection',
      features: heatmapPoints
    };
  };

  useEffect(() => {
    const loadFlightData = async () => {
      let data;

      if (typeof geojsonSource === 'object' && geojsonSource !== null) {
        data = geojsonSource;
      } else if (typeof geojsonSource === 'string') {
        try {
          const response = await fetch(geojsonSource);
          if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
          data = await response.json();
        } catch (error) {
          console.error("Error loading flight trajectory GeoJSON:", error);
          return;
        }
      }

      if (data?.type === 'FeatureCollection' && Array.isArray(data.features)) {
        setTrajectoryGeoJson(data);

        const heatmapData = generateHeatmapFromLines(data, heatmapConfig);
        setHeatmapGeoJson(heatmapData);

        console.log(`Generated ${heatmapData.features.length} heatmap points from ${data.features.length} flight paths.`);
      }
    };

    loadFlightData();
  }, [geojsonSource, heatmapConfig, altitude, beamwidth]);

  return (
    <>
      {/* Flight trajectory line layer */}
      {geojsonSource && trajectoryGeoJson.features.length > 0 && (
        <Source id="trajectory-source" type="geojson" data={trajectoryGeoJson}>
          <Layer
            id="trajectory-line-layer"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{
              'line-color': 'red',
              'line-width': 2,
              'line-opacity': 0.9,
              'line-emissive-strength': 1
            }}
          />
        </Source>
      )}

      {/* Heatmap layer */}
      {geojsonSource && enableDispersions && heatmapGeoJson.features.length > 0 && (
        <Source id="trajectory-heatmap-source" type="geojson" data={heatmapGeoJson}>
          <Layer
            id="trajectory-heatmap-layer"
            type="heatmap"
            paint={{
              'heatmap-weight': ['get', 'weight'],
              'heatmap-intensity': 2,
              'heatmap-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 0.3,
                10, 0.5
              ],
              'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['get', 'altitude'],
                0, 10,
                5, 15,
                10, 30,
                20, 50
              ],
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(33,102,172,0)',
                0.2, 'rgb(103,169,207)',
                0.4, 'rgb(209,229,240)',
                0.6, 'rgb(253,219,199)',
                0.8, 'rgb(239,138,98)',
                1, 'rgb(178,24,43)'
              ]
            }}
          />
        </Source>
      )}
    </>
  );
};

export default FlightTrajectory;
