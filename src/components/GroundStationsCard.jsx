import { useState, useMemo, useRef } from 'react';
import {
  Card,
  TextInput,
  Text,
  Group,
  Stack,
  Badge,
  Button,
  Box,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useVirtualizer } from '@tanstack/react-virtual';

function GroundStationsCard({ stations = [], onClose }) {
  const [search, setSearch] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);

  const parentRef = useRef();

  const filteredStations = useMemo(() => {
    const query = search.toLowerCase();
    return stations.filter((station) =>
      station.name.toLowerCase().includes(query) ||
      station.id.toString().includes(query) ||
      (station.description || '').toLowerCase().includes(query)
    );
  }, [search, stations]);

  // Virtualizer setup
  const rowVirtualizer = useVirtualizer({
    count: filteredStations.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72, // Approx height of each Card
    overscan: 10,
  });

  return (
    <Stack spacing="xs">
      {!selectedStation ? (
        <>
          <TextInput
            placeholder="Search stations..."
            icon={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            radius="md"
            size="sm"
          />

          <Box
            ref={parentRef}
            style={{
              height: 300,
              overflowY: 'auto',
              position: 'relative',
            }}
          >
            <Box
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const station = filteredStations[virtualRow.index];
                return (
                  <Box
                    key={station.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <Card
                      withBorder
                      shadow="xs"
                      padding="sm"
                      radius="md"
                      onClick={() => setSelectedStation(station)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Group position="apart">
                        <Text size="sm" fw={500}>
                          {station.name}
                        </Text>
                        <Badge size="xs" variant="light">#{station.id}</Badge>
                      </Group>
                      <Text size="xs" color="dimmed" lineClamp={2}>
                        {station.description || 'No description'}
                      </Text>
                    </Card>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {filteredStations.length === 0 && (
            <Text size="sm" color="dimmed" align="center">
              No results found
            </Text>
          )}
        </>
      ) : (
        <Card withBorder shadow="sm" radius="md" padding="md">
          <Stack spacing="xs">
            <Text fw={600}>{selectedStation.name}</Text>
            <Text size="sm">ID: {selectedStation.id}</Text>
            <Text size="sm">Latitude: {selectedStation.latitude}</Text>
            <Text size="sm">Longitude: {selectedStation.longitude}</Text>
            <Text size="sm">
              {selectedStation.description || 'No description available'}
            </Text>
            <Group position="right" mt="sm">
              <Button size="xs" variant="light" onClick={() => setSelectedStation(null)}>
                Back
              </Button>
              <Button size="xs" variant="filled" onClick={onClose}>
                Done
              </Button>
            </Group>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}

export default GroundStationsCard;
