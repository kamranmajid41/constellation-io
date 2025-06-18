import { useState, useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mantine/core/styles.css';
import {
  AppShell, Group, Text, Burger, Space,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import Globe from './Globe';
import Settings from './Settings';
import ActiveCard from './ActiveCard';

function ConstellationIo() {
  const [opened, { toggle }] = useDisclosure();
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
      <Text c="green" size="xs" weight={200} style={{ position: 'absolute', left: 10 }}>
        {utcTime}
      </Text>
    );
  };

  return (
    <AppShell

      style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
      navbar={{ width: 66, breakpoint: 'sm', collapsed: { mobile: !opened } }}
    >
        {/* AppShell.Header from parent App component is already there */}

        <AppShell.Navbar p="md" style={{
            height: 'calc(100vh - 60px)', 
            overflowY: 'auto',
            marginTop: '5px', 
        }}>
            <Group>
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                <UTCClock />
            </Group>
            <Space h="15pt" />
            <Settings
                setActivePanel={setActivePanel}
                activePanel={activePanel}
            />
        </AppShell.Navbar>

        <AppShell.Main
          style={{
            paddingTop: '60px', 
            height: 'calc(100vh - 60px)', 
            overflow: 'hidden', 
            display: 'flex', 
            flexDirection: 'column', 
          }}
        >
          <Globe />
          <ActiveCard activePanel={activePanel} setActivePanel={setActivePanel} />
        </AppShell.Main>
    </AppShell>
  );
}

export default ConstellationIo;