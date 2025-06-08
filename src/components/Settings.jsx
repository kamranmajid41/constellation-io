import { useState } from 'react';
import JSZip from 'jszip';
import {
  IconStopwatch,
  IconUpload,
  IconEye,
  IconSatellite, 
  IconAntenna,
  IconCircuitResistor,
  IconRocket
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
  Image
} from '@mantine/core';
import { notifications } from '@mantine/notifications';


function Settings({ setCustomTleData, setFlightTrajectoryData, activePanel, setActivePanel}) {
  const [files, setFiles] = useState({
    tle: null,
    groundTopology: null,
    circuits: null,
    kmz: null,
  });

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

  const handleKmzUpload = async (file) => {
    setFiles((prev) => ({ ...prev, kmz: file }));
    if (!file) {
      setFlightTrajectoryData([]);
      return;
    }

    try {
      const zip = await JSZip.loadAsync(file);
      const kmlEntry = Object.values(zip.files).find(
        (f) => f.name.toLowerCase().endsWith('.kml') && !f.dir
      );

      if (!kmlEntry) throw new Error('No KML file found inside KMZ.');

      const kmlText = await kmlEntry.async('text');
      const kml = new DOMParser().parseFromString(kmlText, 'application/xml');
      const coords = [];

      kml.querySelectorAll('LineString').forEach((line) => {
        const coordText = line.querySelector('coordinates')?.textContent || '';
        const points = coordText.trim().split(/\s+/).map((coord) => {
          const [lon, lat, alt] = coord.split(',').map(Number);
          return { lon, lat, alt: alt || 0 };
        });
        coords.push(...points);
      });

      if (coords.length) {
        setFlightTrajectoryData(coords);
        notifications.show({
          title: 'KMZ Upload Success',
          message: `Loaded ${coords.length} trajectory points.`,
          color: 'green',
        });
      } else {
        throw new Error('No coordinates found in KML LineString.');
      }
    } catch (err) {
      console.error('KMZ Error:', err);
      notifications.show({
        title: 'KMZ Processing Failed',
        message: err.message,
        color: 'red',
      });
      setFlightTrajectoryData([]);
      setFiles((prev) => ({ ...prev, kmz: null }));
    }
  };

  const handleJsonFileChange = (key) => (file) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  return (
    <>
      <Stack
        spacing="xs"
        position="left"
        
      >
       
        <ActionIcon
          variant={activePanel === 'tle' ? 'filled' : 'light'}
          onClick={() => setActivePanel(activePanel === 'tle' ? null : 'tle')}
          size="lg"
        >
          <IconSatellite size={18} />
        </ActionIcon>
        <ActionIcon
          variant={activePanel === 'groundTopology' ? 'filled' : 'light'}
          onClick={() => setActivePanel(activePanel === 'groundTopology' ? null : 'groundTopology')}
          size="lg"
        >
          <IconAntenna size={18} />
        </ActionIcon>
        <ActionIcon
          variant={activePanel === 'circuits' ? 'filled' : 'light'}
          onClick={() => setActivePanel(activePanel === 'circuits' ? null : 'circuits')}
          size="lg"
        >
          <IconCircuitResistor size={18} />
        </ActionIcon>
        <ActionIcon
          variant={activePanel === 'kmz' ? 'filled' : 'light'}
          onClick={() => setActivePanel(activePanel === 'kmz' ? null : 'kmz')}
          size="lg"
        >
          <IconRocket size={18} />
        </ActionIcon>
        <ActionIcon
          variant={activePanel === 'visibility' ? 'filled' : 'light'}
          onClick={() => setActivePanel(activePanel === 'visibility' ? null : 'visibility')}
          size="lg"
        >
          <IconEye size={18} />
        </ActionIcon>
        <ActionIcon
          variant={activePanel === 'schedule' ? 'filled' : 'light'}
          onClick={() => setActivePanel(activePanel === 'schedule' ? null : 'schedule')}
          size="lg"
        >
          <IconStopwatch size={18} />
        </ActionIcon>
      </Stack>
    </>
  );
}

export default Settings;
