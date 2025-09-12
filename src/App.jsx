import React, { useState, useEffect, useRef, lazy, Suspense } from 'react'; // Keep lazy, Suspense
import {
  AppShell,
  Group,
  Text,
  Burger,
  Space,
  Button,
  Title, Center, Stack, Container, SegmentedControl, Box, Image, Card, UnstyledButton, TextInput, Textarea, ThemeIcon
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { GlobalProvider } from './context/GlobalContext';
import { useMediaQuery } from '@mantine/hooks';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'; // Ensure Link is imported

import Contact from './components/ContactUs';
import Careers from './components/Careers';
import HomePage from './components/HomePage';

// LAZY LOAD ConstellationIo
const LazyConstellationIo = lazy(() => import('./components/ConstellationIo')); 

import { IconTarget, IconWorld, IconBulb, IconAtom, IconCertificate, IconDeviceMobile, IconShield, IconSatellite, IconBuilding, IconDeviceDesktop, IconCar, IconWifi, IconCloud, IconArrowsMaximize, IconBroadcast, IconShieldCheck, IconFileText } from '@tabler/icons-react';


function App() {
  const [opened, { toggle }] = useDisclosure();
  const [isMobile, setIsMobile] = useState(false);
  const [activeApp, setActiveApp] = useState('industrial');
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate ? useNavigate() : null;
  const location = useLocation();

  const noHeaderAndFooterPaths = ['/demo']; 
  const showHeaderAndFooter = !noHeaderAndFooterPaths.includes(location.pathname);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent)) {
      setIsMobile(true);
    }
  }, []);

  useEffect(() => {
    const preloadDemo = () => {
      import('./components/ConstellationIo');
    };

    const demoButton = document.querySelector('button[onClick*="/demo"]');
    if (demoButton) {
      demoButton.addEventListener('mouseenter', preloadDemo);
      return () => {
        demoButton.removeEventListener('mouseenter', preloadDemo);
      };
    }
  }, []); 


  const APPLICATIONS = [
  {
    key: 'industrial',
    label: 'Industrial',
    image: '/industrial.jpg',
    description: 'Streamline operations and boost efficiency in agriculture, mining, energy, and logistics with Constellation-io’s AI-powered, space-terrestrial mesh. Achieve real-time monitoring, automation, and control—anywhere on Earth, without reliance on legacy infrastructure.'
  },
  {
    key: 'security',
    label: 'National Security',
    image: '/security.jpg',
    description: 'Deliver resilient, secure communications for defense, emergency response, and critical infrastructure. Constellation-io’s self-healing networks ensure mission-critical connectivity in contested, remote, or denied environments.'
  },
  {
    key: 'devices',
    label: 'Connected Devices',
    image: '/devices.webp',
    description: 'Enable massive-scale IoT and edge deployments with low-latency, high-throughput links. Constellation-io seamlessly connects sensors, vehicles, and smart assets across cities, supply chains, and remote sites.'
  },
  {
    key: 'automotive',
    label: 'Automotive',
    image: '/automotive.jpg',
    description: 'Power next-generation mobility with uninterrupted, global connectivity for autonomous vehicles, fleets, and smart transportation systems. Constellation-io’s adaptive routing ensures safety and performance on every route.'
  },
  {
    key: 'timing',
    label: 'Distributed Timing',
    image: '/timing.jpg',
    description: 'Provide ultra-precise, resilient timing and synchronization for financial services, telecom, and scientific research. Constellation-io’s distributed architecture eliminates single points of failure and legacy dependencies.'
  },
];

  return (
    <GlobalProvider>
      <AppShell>
        {showHeaderAndFooter && (
          <AppShell.Header height={60} p="md" style={{
            background: 'rgba(18,20,28,0.2)',
            borderBottom: '1px #fff',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 4px 24px 0 rgba(30,40,90,0.10)',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 2000,
            fontFamily: 'Inter, Roboto, Arial, sans-serif',
          }}>
            <Group align="center" style={{ height: '100%' }}>
              <a
                href="/"
                onClick={e => { e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); navigate && navigate('/'); }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  marginLeft: 12,
                  marginRight: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                }}
                aria-label="Go to home page"
              >
                <img
                  src="/cio.png"
                  alt="Constellation IO Logo"
                  style={{ height: 44, width: 'auto', display: 'block', objectFit: 'contain' }}
                />
              </a>
              <Box style={{ flex: 1 }} />
              {!isSmallScreen ? (
                <Group spacing="xs" align="center">
                  <Button variant="subtle" color="gray" style={{ color: 'white', fontWeight: 400, fontSize: 16, background: 'none' }} compact onClick={() => {
                    const aboutSection = document.getElementById('about');
                    if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
                  }}> About </Button>
                  <Button variant="subtle" color="gray" style={{ color: 'white', fontWeight: 400, fontSize: 16, background: 'none' }} compact onClick={() => {
                    const applicationsSection = document.getElementById('applications');
                    if (applicationsSection) applicationsSection.scrollIntoView({ behavior: 'smooth' });
                  }}> Applications </Button>
                  <Button variant="subtle" color="gray" style={{ color: 'white', fontWeight: 400, fontSize: 16, background: 'none' }} compact onClick={() => {
                    const companySection = document.getElementById('company');
                    if (companySection) companySection.scrollIntoView({ behavior: 'smooth' });
                  }}> Company </Button>
                  <Button variant="subtle" color="gray" style={{ color: 'white', fontWeight: 400, fontSize: 16, background: 'none' }} compact onClick={() => navigate && navigate('/demo')}> Demo </Button>
                  <Button variant="outline" color="white" style={{ fontWeight: 400, fontSize: 16, borderRadius: 8 }} compact onClick={() => navigate && navigate('/careers')}>Join the team</Button>
                  <Button color="#2aa9a8" style={{ fontWeight: 400, fontSize: 16, borderRadius: 8 }} compact onClick={() => navigate && navigate('/contact')}><Text c='black'>Talk to us</Text></Button>
                </Group>
              ) : (
                <Burger opened={opened} onClick={toggle} color="#fff" size="sm" />
              )}
            </Group>
            {isSmallScreen && opened && (
              <Box style={{
                position: 'absolute',
                top: 60,
                right: 0,
                width: '100vw',
                background: '#181818',
                zIndex: 3000,
                boxShadow: '0 4px 24px 0 rgba(30,40,90,0.10)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                padding: '24px 16px',
              }}>
                <Button variant="subtle" color="gray" style={{ color: 'white', fontWeight: 400, fontSize: 18, background: 'none', width: '100%', textAlign: 'right' }} compact onClick={() => {
                  const aboutSection = document.getElementById('about');
                  if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
                  toggle();
                }}> About </Button>
                <Button variant="subtle" color="gray" style={{ color: 'white', fontWeight: 400, fontSize: 18, background: 'none', width: '100%', textAlign: 'right' }} compact onClick={() => {
                  const applicationsSection = document.getElementById('applications');
                  if (applicationsSection) applicationsSection.scrollIntoView({ behavior: 'smooth' });
                  toggle();
                }}> Applications </Button>
                <Button variant="subtle" color="gray" style={{ color: 'white', fontWeight: 400, fontSize: 18, background: 'none', width: '100%', textAlign: 'right' }} compact onClick={() => {
                  const companySection = document.getElementById('company');
                  if (companySection) companySection.scrollIntoView({ behavior: 'smooth' });
                  toggle();
                }}> Company </Button>
                <Button variant="subtle" color="gray" style={{ color: 'white', fontWeight: 400, fontSize: 18, background: 'none', width: '100%', textAlign: 'right' }} compact onClick={() => { navigate && navigate('/demo'); toggle(); }}> Demo </Button>
                <Button variant="outline" color="white" style={{ fontWeight: 400, fontSize: 18, borderRadius: 8, width: '100%', textAlign: 'right' }} compact onClick={() => { navigate && navigate('/careers'); toggle(); }}>Join the team</Button>
                <Button color="#2aa9a8" style={{ fontWeight: 400, fontSize: 18, borderRadius: 8, width: '100%', textAlign: 'right' }} compact onClick={() => { navigate && navigate('/contact'); toggle(); }}><Text c='black'>Talk to us</Text></Button>
              </Box>
            )}
          </AppShell.Header>
        )}

        <AppShell.Main p={0}>
          <Box style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            position: 'relative',
            paddingTop: 0
          }}>
            <Routes>
              <Route path="/" element={
                <HomePage
                  isSmallScreen={isSmallScreen}
                  APPLICATIONS={APPLICATIONS}
                  activeApp={activeApp}
                  setActiveApp={setActiveApp}
                />
              } />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />

              <Route path="/demo" element={
                !isMobile ? (
                  // If NOT mobile, show the interactive demo
                  <Suspense fallback={<div>Loading Demo...</div>}>
                    <LazyConstellationIo />
                  </Suspense>
                ) : (
                  // If mobile, show the message and YouTube video
                  <Center style={{ height: 'calc(100vh - 60px)', flexDirection: 'column', padding: '20px' }}>
                    <Text size="xl" fw={700} c="red" mb="md">
                      Interactive demo unavailable on mobile
                    </Text>
                    <Text size="lg" c="dimmed" mb="xl" ta="center">
                      Please watch the video walkthrough below.
                    </Text>
                    <iframe
                      width="100%"
                      height="315"
                      src="https://www.youtube.com/embed/VG1BzzSli-8?si=htVvsBMLYN7x4qNt"
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                      referrerPolicy="strict-origin-when-cross-origin"
                      style={{ maxWidth: '1000px', border: 'none' }}
                    ></iframe>
                  </Center>
                )
              } />
            </Routes>
          </Box>
        </AppShell.Main>
      </AppShell>

      {showHeaderAndFooter && (
        <Box component="footer" style={{ background: '#0a0a0a', color: '#fff', width: '100%', padding: '64px 0 0 0', marginTop: 0 }}>
          <Box style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0 24px 32px 24px', gap: 48 }}>
            {/* Left: Logo and newsletter */}
            <Box style={{ flex: 2, minWidth: 320, maxWidth: 420 }}>
              <img src="/cio.png" alt="Constellation-io Logo" style={{ height: 36, marginBottom: 24, filter: 'brightness(0) invert(1)' }} />
              <Title order={3} style={{ color: '#fff', fontWeight: 500, fontSize: 24, marginBottom: 12, letterSpacing: '-0.5px' }}>Keep up to date with news from Constellation-io.</Title>
              <form style={{ display: 'flex', flexDirection: 'row', gap: 8, marginTop: 16 }} onSubmit={e => e.preventDefault()}>
                <TextInput
                  placeholder="info@email.com"
                  style={{ background: '#181818', border: 'none', color: '#fff', flex: 1, minWidth: 0 }}
                  inputStyle={{ background: '#181818', color: '#fff', border: 'none' }}
                  size="md"
                  radius="md"
                  required
                />
                <Button type="submit" style={{ background: '#222', color: '#fff', fontWeight: 500, borderRadius: 8, padding: '0 24px' }}>Submit</Button>
              </form>
            </Box>
            <Box style={{ flex: 1, minWidth: 160 }}>
              <Text size="sm" style={{ color: '#888', fontWeight: 500, letterSpacing: 1, marginBottom: 16 }}>SITEMAP</Text>
              <Stack spacing={8}>
                <UnstyledButton component="a" href="#about" style={{ color: '#fff', fontSize: 18, textAlign: 'left', padding: 0 }}>About</UnstyledButton>
                <UnstyledButton component="a" href="#applications" style={{ color: '#fff', fontSize: 18, textAlign: 'left', padding: 0 }}>Applications</UnstyledButton>
                <UnstyledButton component="a" href="#company" style={{ color: '#fff', fontSize: 18, textAlign: 'left', padding: 0 }}>Company</UnstyledButton>
              </Stack>
            </Box>

            <Box style={{ flex: 1, minWidth: 160 }}>
              <Text size="sm" style={{ color: '#888', fontWeight: 500, letterSpacing: 1, marginBottom: 16 }}>COMPANY</Text>
              <Stack spacing={8}>
                {/* Changed these to use Link component for proper routing */}
                <UnstyledButton component={Link} to="/careers" style={{ color: '#fff', fontSize: 18, textAlign: 'left', padding: 0 }}>Careers</UnstyledButton>
                <UnstyledButton component={Link} to="/contact" style={{ color: '#fff', fontSize: 18, textAlign: 'left', padding: 0 }}>Contact us</UnstyledButton>
              </Stack>
            </Box>
          </Box>
          <Box style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #222', padding: '24px 24px 16px 24px', color: '#888', fontSize: 15 }}>
            <Text size="sm" style={{ color: '#888' }}>© {new Date().getFullYear()} Constellation-io, Inc.</Text>
          </Box>
        </Box>
      )}
    </GlobalProvider>
  );
}

export default App;



