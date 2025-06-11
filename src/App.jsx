import { AppShell, Burger, Group, Space, Text } from '@mantine/core';
import '@mantine/core/styles.css';
import { useDisclosure } from '@mantine/hooks';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import ActiveCard from './components/ActiveCard';
import Globe from './components/Globe';
import Settings from './components/Settings';
import { GlobalProvider } from './context/GlobalContext';

function App() {
  const [opened, { toggle }] = useDisclosure();
  const [flightTrajectoryData, setFlightTrajectoryData] = useState([]);
  const [customTleData, setCustomTleData] = useState(null);
  const [activePanel, setActivePanel] = useState(null);

  const UTCClock = () => {
    const [utcTime, setUtcTime] = useState('');

    useEffect(() => {
      const updateClock = () => {
        setUtcTime(new Date().toUTCString().split(' ')[4]);
      };
      const intervalId = setInterval(updateClock, 1000);
      updateClock();
      return () => clearInterval(intervalId);
    }, []);

    return (
      <Text
        c="green"
        size="xs"
        weight={200}
        style={{
          textAlign: 'center',
          width: '100%',
          marginTop: '-4px',
          marginBottom: '-2px',
        }}
      >
        {utcTime}
      </Text>
    );
  };

  return (
    <GlobalProvider>
      <AppShell
        navbar={{ width: 66, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      >
        <AppShell.Navbar p="md">
          <Group
            gap={8}
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              marginTop: '4px',
            }}
          >
            <img
              src="/constellation-io/2018Lebron.png"
              alt="LeBron Icon"
              style={{
                width: '52px',
                height: '52px',
                objectFit: 'contain',
                display: 'block',
                transform: 'translateX(-2px)',
                marginBottom: '4px',
              }}
            />
            <UTCClock />
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
          </Group>

          <Space h="12pt" />
          <Settings
            setCustomTleData={setCustomTleData}
            setFlightTrajectoryData={setFlightTrajectoryData}
            setActivePanel={setActivePanel}
            activePanel={activePanel}
          />
        </AppShell.Navbar>

        <AppShell.Main>
          <Globe />
          <ActiveCard
            activePanel={activePanel}
            setActivePanel={setActivePanel}
          />
        </AppShell.Main>
      </AppShell>
    </GlobalProvider>
  );
}

export default App;
