import { useState, useEffect} from 'react';
import JSZip from 'jszip'; // Re-import JSZip for KMZ processing
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
import stationData from '../data/satnogs_ground_stations.json';


function ActiveCard({ activePanel, setActivePanel }) {

  const { setUseDefaultConstellation, 
          setUploadedFlightGeoJson, 
          setCustomTleData, 
          beamwidth, setBeamwidth, 
          altitude, setAltitude,
          enableDispersions, setEnableDispersions
        } = useGlobalContext();

  const [files, setFiles] = useState({
    tle: null,
    groundTopology: null,
    circuits: null,
    kmz: null, 
  });
  const [showGroundStations, setShowGroundStations] = useState(false);

  const parseKMLToGeoJSONFeatures = (kmlString, fileName) => {
    const parser = new DOMParser();
    const kmlDoc = parser.parseFromString(kmlString, "application/xml");
    const features = [];
    const errors = [];

    // const KML_NAMESPACE = 'http://www.opengis.net/kml/2.2';

    kmlDoc.querySelectorAll('Placemark').forEach(placemarkEl => {
      const lineStringEl = placemarkEl.querySelector('LineString');
      if (lineStringEl) {
        const coordinatesText = lineStringEl.querySelector('coordinates')?.textContent?.trim();
        if (coordinatesText) {
          try {
            const coordinates = coordinatesText.split(/\s+/).map(coordPair => {
              const parts = coordPair.split(',').map(Number);
              // Ensure 3 elements: lon, lat, alt. Default alt to 0 if not present.
              if (parts.length < 2) {
                throw new Error(`Malformed coordinate: ${coordPair}`);
              }
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


  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleTleUpload = (file) => {
    setFiles((prev) => ({ ...prev, tle: file }));
    if (!file) {
      setCustomTleData(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const isValid = Array.isArray(data) && data.every(
          (item) =>
            typeof item === 'object' &&
            typeof item.satelliteName === 'string' &&
            typeof item.tleLine1 === 'string' &&
            typeof item.tleLine2 === 'string'
        );

        if (isValid) {
          setCustomTleData(data);
          notifications.show({
            title: 'TLE Upload Success',
            message: 'Custom TLE constellation loaded successfully.',
            color: 'green',
          });
        } else {
          throw new Error('Invalid TLE format');
        }
      } catch (err) {
        console.error('TLE Parsing Error:', err);
        notifications.show({
          title: 'Invalid TLE JSON',
          message: 'Expected an array of objects with satelliteName, tleLine1, tleLine2.',
          color: 'red',
        });
        setCustomTleData(null);
        setFiles((prev) => ({ ...prev, tle: null }));
      }
    };

    reader.readAsText(file);
  };

  // Handler for uploading multiple KMZ files for flight trajectories
  const handleKmzUpload = async (selectedFiles) => {
    // Mantine FileInput passes null if cleared, or a File/File[] object
    const filesToProcess = Array.isArray(selectedFiles) ? selectedFiles : (selectedFiles ? [selectedFiles] : []);

    setFiles((prev) => ({ ...prev, kmz: filesToProcess })); // Store the array of selected files

    if (filesToProcess.length === 0) {
      setUploadedFlightGeoJson(null); // Clear data if no files selected
      notifications.show({
        title: 'Files Cleared',
        message: 'Flight trajectory data cleared.',
        color: 'gray',
      });
      return;
    }

    const allFeatures = [];
    const processingErrors = [];

    const processFile = async (file) => {
      if (!file.name.toLowerCase().endsWith('.kmz')) {
        processingErrors.push(`Skipping "${file.name}": Not a KMZ file.`);
        return;
      }

      try {
        const zip = await JSZip.loadAsync(file);
        const kmlEntry = Object.values(zip.files).find(
          (f) => f.name.toLowerCase().endsWith('.kml') && !f.dir
        );

        if (!kmlEntry) {
          throw new Error('No KML file found inside KMZ.');
        }

        const kmlText = await kmlEntry.async('text');
        const { features, errors } = parseKMLToGeoJSONFeatures(kmlText, file.name);

        if (errors.length > 0) {
          processingErrors.push(...errors.map(err => `[${file.name}] ${err}`));
        }
        allFeatures.push(...features);

      } catch (err) {
        processingErrors.push(`Error processing "${file.name}": ${err.message}`);
        console.error(`Error processing KMZ file "${file.name}":`, err);
      }
    };

    try {
      // Use Promise.all to process all files concurrently
      await Promise.all(filesToProcess.map(processFile));

      if (allFeatures.length > 0) {
        const combinedGeoJson = {
          type: 'FeatureCollection',
          features: allFeatures
        };
        setUploadedFlightGeoJson(combinedGeoJson); // Update global state with combined data
        notifications.show({
          title: 'KMZ Upload Success',
          message: `Loaded ${allFeatures.length} trajectories from ${filesToProcess.length} KMZ files.`,
          color: 'green',
        });
      } else {
        throw new Error('No valid flight trajectories found in the uploaded KMZ files.');
      }

      if (processingErrors.length > 0) {
        notifications.show({
          title: 'KMZ Upload Warnings/Errors',
          message: `Some files had issues: ${processingErrors.join('; ')}. See console for details.`,
          color: 'orange',
          autoClose: 10000,
        });
      }

    } catch (finalError) {
      console.error("Overall error during multi-KMZ upload:", finalError);
      notifications.show({
        title: 'KMZ Upload Failed',
        message: finalError.message || 'An unexpected error occurred during KMZ processing.',
        color: 'red',
      });
      setUploadedFlightGeoJson(null); // Clear data on error
      setFiles((prev) => ({ ...prev, kmz: null })); // Reset file input
    }
  };


  // Generic handler for other JSON files (groundTopology, circuits)
  const handleJsonFileChange = (key) => (file) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
    // You might want to add specific parsing and state updates here
    // for groundTopology and circuits if they are more than just file references.
  };

   const onAltitudeChange = (val) => {
    setAltitude(val);
  };

  const onBeamwidthChange = (val) => {
    setBeamwidth(val);
  };

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
            width: 300,
            zIndex: 999,
            maxHeight: "90vh"

          }}
        >
          <Group position="apart" mb="sm">
            <Text fw={500} size="sm" transform="capitalize">{
              activePanel === 'tle' ? "Upload constellation" :
              activePanel === 'groundTopology' ? "Ground stations" :
              activePanel === 'circuits' ? "Upload circuits" :
              activePanel === 'kmz' ? "Upload flight trajectories" : ""
            }</Text>
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

                {/* New input fields for altitude and beamwidth */}
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


            {activePanel === 'visibility' && (
              <Text size="sm" c="dimmed">Visibility panel under construction.</Text>
            )}

            {activePanel === 'schedule' && (
              <Text size="sm" c="dimmed">Schedule jobs panel under construction.</Text>
            )}
          </Stack>
        </Card>
      )}
    </>
  );
};
export default ActiveCard;
