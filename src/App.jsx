import { useState, useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mantine/core/styles.css';
import { AppShell, Group, Text, Card, Burger, Skeleton, Title, Space} from '@mantine/core';
import Globe from './components/Globe'; 
import Settings from './components/Settings'; 
import ActiveCard from './components/ActiveCard';
import { useDisclosure } from '@mantine/hooks';
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
      updateClock(); // Initial call
      return () => clearInterval(intervalId);
    }, []);

    return <Text 
              c='green' component="span" size="xs" weight={200} 
              style={{left: 6, position: 'absolute'}}
            >
                {utcTime}
           </Text>;
  };

  return (
    <>
      <GlobalProvider>
        <AppShell
          navbar={{ width: 66, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        >
          <AppShell.Navbar p="md">
            <Group>
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              <UTCClock />
            </Group>
            <Space h='15pt'/>
        
            <Settings
              setCustomTleData={setCustomTleData}
              setFlightTrajectoryData={setFlightTrajectoryData}
              setActivePanel={setActivePanel}
              activePanel={activePanel}
            />
        
          </AppShell.Navbar>
          <AppShell.Main>
            <Globe/>
            <ActiveCard
              activePanel={activePanel}
              setActivePanel={setActivePanel}
            />
          </AppShell.Main>
        </AppShell>

      </GlobalProvider>
    </>
  );
}

  // <Button
  //           onClick={resetMapView}
  //           variant="filled"
  //           size="lg"
  //           style={{
  //             position: 'absolute',
  //             top: 5,
  //             left: 0,
  //             zIndex: 10,
  //             padding: '10px 20px',
  //             fontFamily: 'Courier New, Courier, monospace',
  //             fontSize: '18px',
  //             fontWeight: 'light',
  //             backgroundColor: '#000',
  //             color: '#fff',
  //           }}
  //         >
  //           constellation-io
  //         </Button>

  //         <Settings
  //           setCustomTleData={setCustomTleData}
  //           setFlightTrajectoryData={setFlightTrajectoryData}
  //         />

  //         <Button
  //           style={{
  //               position: 'absolute',
  //               bottom: 0,
  //               left: 0,
  //               zIndex: 100,
  //               backgroundColor: '#000',
  //               color: '#fff',
  //             }}
  //         >
  //           <Group position="apart" align="center" mb="sm">
  //             <IconClockHour4 size={15} color='grey'/>
  //             <Text size="sm" weight={200}>
  //               <UTCClock />
  //             </Text>
  //           </Group>
  //         </Button>

export default App;
