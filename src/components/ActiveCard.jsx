import { useState, useEffect } from 'react';
import JSZip from 'jszip';
import Plot from 'react-plotly.js'; // ✅ Import Plotly

import {
  IconStopwatch,
  IconUpload,
  IconEye,
} from '@tabler/icons-react';

import {
  Box,
  ActionIcon,
  FileInput,
  Card,
  Text,
  Group,
  Stack,
  CloseButton,
  Checkbox,
  NumberInput
} from '@mantine/core';

import { notifications } from '@mantine/notifications';
import { useGlobalContext } from '../context/GlobalContext';

import GroundStationsCard from './GroundStationsCard';
import Visibility from './Visibility';
import stationData from '../data/satnogs_ground_stations.json';

function ActiveCard({ activePanel, setActivePanel }) {
  const {
    setUseDefaultConstellation,
    setUploadedFlightGeoJson,
    setCustomTleData,
    beamwidth, setBeamwidth,
    altitude, setAltitude,
    setEnableDispersions
  } = useGlobalContext();

  const [files, setFiles] = useState({
    tle: null,
    groundTopology: null,
    circuits: null,
    kmz: null,
  });

  const [showGroundStations, setShowGroundStations] = useState(false);

  // KML -> GeoJSON
  const parseKMLToGeoJSONFeatures = (kmlString, fileName) => {
    const parser = new DOMParser();
    const kmlDoc = parser.parseFromString(kmlString, "application/xml");
    const features = [];
    const errors = [];

    kmlDoc.querySelectorAll('Placemark').forEach(placemarkEl => {
      const lineStringEl = placemarkEl.querySelector('LineString');
      if (lineStringEl) {
        const coordinatesText = lineStringEl.querySelector('coordinates')?.textContent?.trim();
        if (coordinatesText) {
          try {
            const coordinates = coordinatesText.split(/\s+/).map(coordPair => {
              const parts = coordPair.split(',').map(Number);
              if (parts.length < 2) throw new Error(`Malformed coordinate: ${coordPair}`);
              return [parts[0], parts[1], parts[2] || 0];
            });

            const nameEl = placemarkEl.querySelector('name');
            const name = nameEl?.textContent || `Track from ${fileName}`;

            features.push({
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: coordinates
              },
              properties: {
                name: name,
                sourceFile: fileName,
              }
            });
          } catch (coordParseError) {
            errors.push(`Error parsing coordinates in file "${fileName}": ${coordParseError.message}`);
          }
        }
      }
    });

    if (features.length === 0 && errors.length === 0) {
      errors.push(`No LineString features found in file "${fileName}".`);
    }

    return { features, errors };
  };

  // Upload handlers remain unchanged
  const handleTleUpload = (file) => { /* ...same as before... */ };
  const handleKmzUpload = async (selectedFiles) => { /* ...same as before... */ };
  const handleJsonFileChange = (key) => (file) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };
  const onAltitudeChange = (val) => setAltitude(val);
  const onBeamwidthChange = (val) => setBeamwidth(val);

  return (
    <>
      {activePanel && (
        <Card
          shadow="sm"
          padding="md"
          radius="md"
          withBorder
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            width: activePanel === 'graph' ? 500 : 300, // 📊 Make wider for graph
            zIndex: 999,
            maxHeight: "90vh"
          }}
        >
          <Group position="apart" mb="sm">
            <Text fw={500} size="sm" transform="capitalize">
              {
                activePanel === 'tle' ? "Upload constellation" :
                activePanel === 'groundTopology' ? "Ground stations" :
                activePanel === 'circuits' ? "Upload circuits" :
                activePanel === 'visibility' ? "Change visibility" :
                activePanel === 'kmz' ? "Upload flight trajectories" :
                activePanel === 'schedule' ? "Schedule jobs" :
                activePanel === 'graph' ? "Graph Visualization" :
                ""
              }
            </Text>
            <CloseButton onClick={() => setActivePanel(null)} size="sm" />
          </Group>

          <Stack spacing="sm">
            {activePanel === 'tle' && (
              <>
                <FileInput
                  placeholder="Upload TLE (.json)"
                  accept=".json"
                  value={files.tle}
                  onChange={handleTleUpload}
                  clearable
                />
                or
                <Checkbox
                  label="use default (Starlink)"
                  onChange={(event) => setUseDefaultConstellation(event.currentTarget.checked)}
                />
              </>
            )}

            {activePanel === 'groundTopology' && (
              <GroundStationsCard
                stations={stationData}
                onClose={() => setActivePanel(null)}
              />
            )}

            {activePanel === 'circuits' && (
              <FileInput
                placeholder="Upload Circuits"
                accept=".json"
                value={files.circuits}
                onChange={handleJsonFileChange('circuits')}
                clearable
              />
            )}

            {activePanel === 'kmz' && (
              <>
                <FileInput
                  placeholder="Choose one or more KMZ files"
                  accept=".kmz,application/vnd.google-earth.kmz"
                  icon={<IconUpload size={18} />}
                  onChange={handleKmzUpload}
                  clearable
                  multiple
                  value={files.kmz}
                />
                <Checkbox
                  label="enable dispersions"
                  onChange={(event) => setEnableDispersions(event.currentTarget.checked)}
                />
                <NumberInput
                  label="Altitude (km)"
                  value={altitude}
                  min={0}
                  step={1}
                  onChange={onAltitudeChange}
                  withAsterisk
                />
                <NumberInput
                  label="Antenna Beamwidth (deg)"
                  value={beamwidth}
                  min={1}
                  step={1}
                  onChange={onBeamwidthChange}
                  withAsterisk
                />
              </>
            )}

            {activePanel === 'visibility' && <Visibility />}

            {activePanel === 'schedule' && (
              <Text size="sm" c="dimmed">Schedule jobs panel under construction.</Text>
            )}

            {/* 📊 GRAPH PANEL: Shows empty Plotly chart */}
            {activePanel === 'graph' && (
              <Plot
                data={[
                  {
                    x: [],
                    y: [],
                    type: 'scatter',
                    mode: 'lines+markers',
                    marker: { size: 6 }
                  }
                ]}
                layout={{
                  title: 'Flight Data Plot',
                  xaxis: { title: 'Index' },
                  yaxis: { title: 'Value' },
                  autosize: true
                }}
                style={{ width: '100%', height: '300px' }}
                config={{ responsive: true, displaylogo: false }}
              />
            )}
          </Stack>
        </Card>
      )}
    </>
  );
}

export default ActiveCard;
