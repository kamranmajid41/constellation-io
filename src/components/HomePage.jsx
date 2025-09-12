import React, { useEffect } from 'react';
import { Box, Stack, Title, Text, Group, ThemeIcon } from '@mantine/core';
import { IconArrowsMaximize, IconBroadcast, IconShieldCheck, IconFileText, IconBrandLinkedin } from '@tabler/icons-react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

export default function HomePage({
  isSmallScreen,
  APPLICATIONS,
  activeApp,
  setActiveApp,
}) {
  // Add CSS animation for carousel
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes carousel-spin {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const navigate = useNavigate ? useNavigate() : null;

  return (
    <>
      <Box style={{
        width: '100%',
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 100%,rgb(1, 66, 82) 0%, #07090c 70%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
        paddingBottom: 80,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Stack align="center" spacing={24} style={{ zIndex: 1, color: 'white' }}>
          <Title order={1} align="center" style={{ fontWeight: 500, fontSize: '3.2rem', letterSpacing: '-1px', lineHeight: 1.1 }}>
            Earth. Space. Connected.
          </Title>
          <Text align="center" size="xl" style={{ maxWidth: 700, opacity: 0.85, fontWeight: 400 }}>
            AI-powered, resilient networks for secure, high-speed data anywhere.
          </Text>
          <button style={{ fontWeight: 500, fontSize: 15, marginTop: 8, padding: '0.6em 2em', border: '1px solid #fff', background: 'transparent', color: '#fff', borderRadius: 8, cursor: 'pointer' }}
            onClick={() => navigate && navigate('/contact')}
          >
            Get early access
          </button>
        </Stack>
      </Box>
      {/* About Section */}
      <div id="about" style={{ scrollMarginTop: 100 }} />
      <Box style={{
        minHeight: '100vh',
        width: '100%',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '0 16px',
        fontFamily: 'Inter, Roboto, Arial, sans-serif',
        paddingBottom: 80,
      }}>
        <div style={{ height: 40 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#2aa9a8', display: 'inline-block', marginRight: 8 }} />
          <Text size="sm" style={{ color: '#2aa9a8', fontWeight: 500, letterSpacing: 1 }}>Introducing Constellation-io</Text>
        </div>
        <Title order={2} align="center" style={{ fontWeight: 500, fontSize: '2.8rem', marginBottom: 24, color: '#111', letterSpacing: '-1px', lineHeight: 1.1, marginTop: 0 }}>
          The next generation of space connectivity
        </Title>
        <Text
          align="center"
          size="xl"
          color='grey'
          style={{ maxWidth: 900, margin: '0 auto 32px auto', opacity: 0.8 }}
        >
          Our platform is geared to revolutionize space telecom by optimizing existing infrastructure.
        </Text>
        <div style={{ width: '80vw', maxWidth: '600px', margin: '0', marginTop: '0', marginBottom: '0', height: 'min(15vw, 300px)', overflow: 'hidden', display: 'block' }}>
          <img
            src="/mesh.png"
            alt="Mesh network illustration"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block'}}
          />
        </div>
        {/* Three Feature Columns */}
        <Group
          grow
          spacing={isSmallScreen ? 32 : 64}
          style={{
            maxWidth: 1200,
            margin: isSmallScreen ? '40px auto 40px auto' : '64px auto 80px auto',
            width: '100%',
            alignItems: isSmallScreen ? 'center' : 'flex-start',
            flexDirection: isSmallScreen ? 'column' : 'row',
          }}
        >
          <Box style={{ display: 'flex', flexDirection: 'column', alignItems: isSmallScreen ? 'center' : 'flex-start', flex: 1, width: isSmallScreen ? '100%' : undefined, maxWidth: isSmallScreen ? 500 : undefined, textAlign: isSmallScreen ? 'center' : 'left', marginBottom: isSmallScreen ? 24 : 0 }}>
            <ThemeIcon size={40} radius="xl" color="#2aa9a8" style={{ marginBottom: 20, background: '#2aa9a8' }}>
              <IconArrowsMaximize size={28} stroke={1.5} />
            </ThemeIcon>
            <Title order={4} style={{ fontWeight: 600, marginBottom: 12, color: '#111', fontSize: isSmallScreen ? 20 : 24 }}>Effortless Integration</Title>
            <Text size={isSmallScreen ? 'sm' : 'md'} style={{ color: '#222', fontWeight: 400, lineHeight: 1.6 }}>
              Seamlessly connect satellites, ground stations, and terrestrial networks with Constellation-io’s AI-driven orchestration—no custom hardware required. Instantly enhance existing infrastructure for next-generation connectivity.
            </Text>
          </Box>
          <Box style={{ display: 'flex', flexDirection: 'column', alignItems: isSmallScreen ? 'center' : 'flex-start', flex: 1, width: isSmallScreen ? '100%' : undefined, maxWidth: isSmallScreen ? 500 : undefined, textAlign: isSmallScreen ? 'center' : 'left', marginBottom: isSmallScreen ? 24 : 0 }}>
            <ThemeIcon size={40} radius="xl" color="#2aa9a8" style={{ marginBottom: 20, background: '#2aa9a8' }}>
              <IconBroadcast size={28} stroke={1.5} />
            </ThemeIcon>
            <Title order={4} style={{ fontWeight: 600, marginBottom: 12, color: '#111', fontSize: isSmallScreen ? 20 : 24 }}>Global Reach, Always-On</Title>
            <Text size={isSmallScreen ? 'sm' : 'md'} style={{ color: '#222', fontWeight: 400, lineHeight: 1.6 }}>
              Our adaptive mesh leverages advanced graph theory to deliver high-capacity, low-latency data—across continents, oceans, and remote regions. Maintain robust links even in challenging or underserved environments.
            </Text>
          </Box>
          <Box style={{ display: 'flex', flexDirection: 'column', alignItems: isSmallScreen ? 'center' : 'flex-start', flex: 1, width: isSmallScreen ? '100%' : undefined, maxWidth: isSmallScreen ? 500 : undefined, textAlign: isSmallScreen ? 'center' : 'left', marginBottom: isSmallScreen ? 0 : 0 }}>
            <ThemeIcon size={40} radius="xl" color="#2aa9a8" style={{ marginBottom: 20, background: '#2aa9a8' }}>
              <IconShieldCheck size={28} stroke={1.5} />
            </ThemeIcon>
            <Title order={4} style={{ fontWeight: 600, marginBottom: 12, color: '#111', fontSize: isSmallScreen ? 20 : 24 }}>Resilience by Intelligence</Title>
            <Text size={isSmallScreen ? 'sm' : 'md'} style={{ color: '#222', fontWeight: 400, lineHeight: 1.6 }}>
              Self-healing, self-optimizing networks automatically reroute around outages and threats. Constellation-io’s intelligent platform ensures secure, uninterrupted data flow for mission-critical operations.
            </Text>
          </Box>
        </Group>
        {/* Applications Section */}
        <Box style={{
          width: '100vw',
          background: '#111',
          borderRadius: 0,
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : 'row',
          minHeight: isSmallScreen ? 0 : 800,
          padding: isSmallScreen ? '32px 0' : undefined,
        }} id="applications">
          {/* Left: Application List */}
          <Box style={{
            flex: 1,
            minWidth: isSmallScreen ? '100%' : 340,
            maxWidth: isSmallScreen ? '100%' : 520,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: isSmallScreen ? '0 6vw 24px 6vw' : '64px 0 64px 7vw',
            alignItems: isSmallScreen ? 'center' : 'flex-start',
          }}>
            <Text size="sm" style={{ color: '#2aa9a8', fontWeight: 500, letterSpacing: 1, marginBottom: 32 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#2aa9a8', display: 'inline-block', marginRight: 8 }} />
              Applications
            </Text>
            {APPLICATIONS.map(app => (
              <div
                key={app.key}
                style={{
                  fontFamily: 'Inter, Roboto, Arial, sans-serif',
                  fontWeight: app.key === activeApp ? 600 : 400,
                  fontSize: isSmallScreen ? '1.6rem' : '2.6rem',
                  color: app.key === activeApp ? '#2aa9a8' : '#fff',
                  marginBottom: 18,
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  letterSpacing: '-1px',
                  textAlign: isSmallScreen ? 'center' : 'left',
                }}
                onClick={() => setActiveApp(app.key)}
              >
                {app.label}
              </div>
            ))}
          </Box>
          {/* Right: Application Image & Description */}
          <Box style={{
            flex: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            minHeight: isSmallScreen ? 0 : 400,
            padding: isSmallScreen ? '0 6vw' : '0 4vw',
            width: isSmallScreen ? '100%' : undefined,
          }}>
            {APPLICATIONS.map(app => app.key === activeApp && (
              <Box key={app.key} style={{
                width: '100%',
                height: isSmallScreen ? 'auto' : '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isSmallScreen ? 'center' : 'flex-end',
                justifyContent: 'center',
              }}>
                <Box style={{
                  position: 'relative',
                  width: isSmallScreen ? '90vw' : 700,
                  maxWidth: 700,
                  height: isSmallScreen ? '50vw' : 700,
                  maxHeight: isSmallScreen ? 320 : 700,
                  marginBottom: 24,
                  borderRadius: 0,
                  overflow: 'hidden',
                  background: '#222',
                }}>
                  <img src={app.image} alt={app.label} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0 }} />
                  <Box style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    width: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                    padding: isSmallScreen ? '20px 12px 16px 12px' : '32px 32px 24px 32px',
                    fontSize: isSmallScreen ? 16 : 22,
                    fontWeight: 400,
                    textAlign: 'left',
                    lineHeight: 1.5,
                    letterSpacing: 0,
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                  }}>
                    {app.description}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        {/* Logo Carousel */}
        <Box style={{ width: '100%', margin: '56px 0 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Title order={3} align="center" style={{ fontWeight: 500, fontSize: '1.6rem', marginBottom: 32, color: '#111' }}>
            Built by <span style={{ color: '#2aa9a8', fontWeight: 700 }}>engineers</span> from
          </Title>
          <Box style={{
            width: '100%',
            maxWidth: 1100,
            overflow: 'hidden',
            position: 'relative',
            height: 64,
            margin: '0 auto',
          }}>
            <Box
              className="logo-carousel-track"
              style={{
                display: 'flex',
                alignItems: 'center',
                minWidth: '200%',
                animation: 'carousel-spin 18s linear infinite',
                willChange: 'transform',
              }}
              onMouseOver={e => e.currentTarget.style.animationPlayState = 'paused'}
              onMouseOut={e => e.currentTarget.style.animationPlayState = 'running'}
            >
              {/* First set of logos */}
              <img src="/spacex.png" alt="SpaceX" style={{ height: 48, filter: 'grayscale(1)', objectFit: 'contain', margin: '0 32px' }} />
              <img src="/nasa.png" alt="NASA" style={{ height: 48, filter: 'grayscale(1)', objectFit: 'contain', margin: '0 32px' }} />
              <img src="/blue.png" alt="Blue" style={{ height: 48, filter: 'grayscale(1)', objectFit: 'contain', margin: '0 32px' }} />
              {/* Duplicate for seamless loop */}
              <img src="/spacex.png" alt="SpaceX" style={{ height: 48, filter: 'grayscale(1)', objectFit: 'contain', margin: '0 32px' }} />
              <img src="/nasa.png" alt="NASA" style={{ height: 48, filter: 'grayscale(1)', objectFit: 'contain', margin: '0 32px' }} />
              <img src="/blue.png" alt="Blue" style={{ height: 48, filter: 'grayscale(1)', objectFit: 'contain', margin: '0 32px' }} />
            </Box>
          </Box>
        </Box>
        {/* Replace the 'Novel Technology & Foundational IP' section with a clean, three-column layout matching the feature section above */}
        <Box style={{
          margin: '96px auto 0 auto',
          maxWidth: 1200,
          width: '100%',
          background: '#fff',
          padding: '0 24px 96px 24px',
        }}>
          <Text align="center" size="xl" style={{ maxWidth: 900, margin: '0 auto 56px auto', color: '#666', fontWeight: 400, fontSize: 20 }}>
            Constellation-io's unique strength lies in its groundbreaking integration of graph theory for resilient network modeling and AI for predictive dynamic optimization.  </Text>
          <Group
            grow
            spacing={isSmallScreen ? 32 : 64}
            style={{
              maxWidth: 1200,
              margin: '0 auto',
              width: '100%',
              alignItems: isSmallScreen ? 'center' : 'flex-start',
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
            <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, width: isSmallScreen ? '100%' : undefined, maxWidth: isSmallScreen ? 500 : undefined, textAlign: isSmallScreen ? 'center' : 'left', marginBottom: isSmallScreen ? 24 : 0 }}>
              <ThemeIcon size={44} radius="xl" color="#2aa9a8" style={{ marginBottom: 32, background: '#2aa9a8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconFileText size={28} stroke={1.5} color="#fff" />
              </ThemeIcon>
              <Title order={4} align="center" style={{ fontWeight: 600, marginBottom: 12, color: '#111', fontSize: isSmallScreen ? 18 : 20, letterSpacing: '-0.5px' }}>
                "Intelligent Resource Management for ..."
              </Title>
              <Text align="center" size={isSmallScreen ? 'sm' : 'md'} style={{ color: '#444', fontWeight: 400, lineHeight: 1.6 }}>
                By M. Jia, Z. Ximu. IEEE Wireless Communications, 2020.<br/>
                <a href="https://www.researchgate.net/publication/339701134_Intelligent_Resource_Management_for_Satellite_and_Terrestrial_Spectrum_Shared_Networking_toward_B5G" target="_blank" rel="noopener noreferrer" style={{ color: '#2aa9a8', textDecoration: 'none', fontWeight: 500 }}>Read the full paper here</a>
              </Text>
            </Box>
            <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, width: isSmallScreen ? '100%' : undefined, maxWidth: isSmallScreen ? 500 : undefined, textAlign: isSmallScreen ? 'center' : 'left', marginBottom: isSmallScreen ? 24 : 0 }}>
              <ThemeIcon size={44} radius="xl" color="#2aa9a8" style={{ marginBottom: 32, background: '#2aa9a8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconFileText size={28} stroke={1.5} color="#fff" />
              </ThemeIcon>
              <Title order={4} align="center" style={{ fontWeight: 600, marginBottom: 12, color: '#111', fontSize: isSmallScreen ? 18 : 20, letterSpacing: '-0.5px' }}>
                "Graph-Theoretic AI for Global Connectivity"
              </Title>
              <Text align="center" size={isSmallScreen ? 'sm' : 'md'} style={{ color: '#444', fontWeight: 400, lineHeight: 1.6 }}>
                By K. Majid. MDPI, Electronics.<br/>
                <a href="https://drive.google.com/file/d/1Vz6glzOfYwdiuNvSKZYZ7nkEepOwprf2/view?usp=sharing" target="_blank" rel="noopener noreferrer" style={{ color: '#2aa9a8', textDecoration: 'none', fontWeight: 500 }}>Read the full paper here</a>
              </Text>
            </Box>
            <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, width: isSmallScreen ? '100%' : undefined, maxWidth: isSmallScreen ? 500 : undefined, textAlign: isSmallScreen ? 'center' : 'left', marginBottom: isSmallScreen ? 0 : 0 }}>
              <ThemeIcon size={44} radius="xl" color="#2aa9a8" style={{ marginBottom: 32, background: '#2aa9a8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconFileText size={28} stroke={1.5} color="#fff" />
              </ThemeIcon>
              <Title order={4} align="center" style={{ fontWeight: 600, marginBottom: 12, color: '#111', fontSize: isSmallScreen ? 18 : 20, letterSpacing: '-0.5px' }}>
                "Robustness of satellite constellation networks"
              </Title>
              <Text align="center" size={isSmallScreen ? 'sm' : 'md'} style={{ color: '#444', fontWeight: 400, lineHeight: 1.6 }}>
                By X. Xu, Z. Gao, A. Liu. Computer Communications, 2023.<br/>
                <a href="https://doi.org/10.1016/j.comcom.2023.07.036" target="_blank" rel="noopener noreferrer" style={{ color: '#2aa9a8', textDecoration: 'none', fontWeight: 500 }}>Read the full paper here</a>
              </Text>
            </Box>
          </Group>
        </Box>
      </Box>
      {/* Add Company section after the hero/features */}
      <div id="company" style={{ scrollMarginTop: 80 }} />
      <Box style={{ width: '100%', background: '#e5e7eb', padding: '96px 0 96px 0', minHeight: 600 }}>
        <Box style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 48, flexWrap: 'wrap' }}>
          {/* Left: Headline and text */}
          <Box style={{ flex: 2, minWidth: 320, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Group spacing={8} align="center" style={{ marginBottom: 16 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#2aa9a8', display: 'inline-block' }} />
              <Text size="md" style={{ color: '#2aa9a8', fontWeight: 500, letterSpacing: 1 }}>Company</Text>
            </Group>
            <Title order={1} align="left" style={{ fontWeight: 700, fontSize: '2.8rem', marginBottom: 24, color: '#111', letterSpacing: '-1px', lineHeight: 1.1 }}>
              Pioneering the Future of Space Connectivity and Intelligent Networks
            </Title>
            <Text size="xl" align="left" style={{ color: '#222', fontWeight: 400, fontSize: 20, marginBottom: 32, maxWidth: 700 }}>
                Constellation-io uses cutting-edge AI and graph theory to build a new foundation for resilient, high-capacity, and ultra-low-latency data transfer. Our platform integrates terrestrial and orbital networks, enabling secure, adaptive, and self-healing connectivity for critical applications in defense, IoT, and remote operations. We are redefining global communications by overcoming unreliable space telecommunications.<br/><br/>
                Our founders have experienced firsthand the pitfalls and limitations of current strategies while working at top space companies. This unique perspective fuels our mission to build something fundamentally better. <br/><br/>
              </Text>
          </Box>
          {/* Right: Founders in a 2x2 grid */}
          <Box style={{ flex: 1.2, minWidth: 320, maxWidth: 400, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start', marginTop: '70px'}}>
            {/* Kamran Majid */}
            <Box style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src="/kam_headshot.jpeg" alt="Kamran Majid, Founder" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginBottom: 8, boxShadow: '0 2px 12px 0 rgba(30,40,90,0.10)' }} />
              <Text size="sm" style={{ fontWeight: 600, color: '#111', marginBottom: 2 }}>Kamran Majid</Text>
              <Text size="xs" style={{ color: '#666', marginBottom: 6 }}>Founder & CEO</Text>
              <a href="https://www.linkedin.com/in/kamran-majid-0571121b0/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <IconBrandLinkedin size={16} color="#0077b5" style={{ cursor: 'pointer', transition: 'opacity 0.2s' }} />
              </a>
            </Box>

            {/* Omeed Tehrani */}
            <Box style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src="/omeed.jpeg" alt="Omeed Tehrani, Founder" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginBottom: 8, boxShadow: '0 2px 12px 0 rgba(30,40,90,0.10)' }} />
              <Text size="sm" style={{ fontWeight: 600, color: '#111', marginBottom: 2 }}>Omeed Tehrani</Text>
              <Text size="xs" style={{ color: '#666', marginBottom: 6 }}>Head of Operations</Text>
              <a href="https://www.linkedin.com/in/omeedtehrani/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <IconBrandLinkedin size={16} color="#0077b5" style={{ cursor: 'pointer', transition: 'opacity 0.2s' }} />
              </a>
            </Box>

            {/* Raaid Kabir */}
            <Box style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src="/raaid.jpeg" alt="Raaid Kabir, Founder" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginBottom: 8, boxShadow: '0 2px 12px 0 rgba(30,40,90,0.10)' }} />
              <Text size="sm" style={{ fontWeight: 600, color: '#111', marginBottom: 2 }}>Raaid Kabir</Text>
              <Text size="xs" style={{ color: '#666', marginBottom: 6 }}>Founding Engineer</Text>
              <a href="https://www.linkedin.com/in/raaid-kabir/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <IconBrandLinkedin size={16} color="#0077b5" style={{ cursor: 'pointer', transition: 'opacity 0.2s' }} />
              </a>
            </Box>

            {/* Laith Altarabishi */}
            <Box style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src="/laith.jpeg" alt="Laith Altarabishi, Founder" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginBottom: 8, boxShadow: '0 2px 12px 0 rgba(30,40,90,0.10)' }} />
              <Text size="sm" style={{ fontWeight: 600, color: '#111', marginBottom: 2 }}>Laith Altarabishi</Text>
              <Text size="xs" style={{ color: '#666', marginBottom: 6 }}>Founding Engineer</Text>
              <a href="https://www.linkedin.com/in/laithaustin/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <IconBrandLinkedin size={16} color="#0077b5" style={{ cursor: 'pointer', transition: 'opacity 0.2s' }} />
              </a>
            </Box>
          </Box>
        </Box>
      </Box>
      {/* Careers section removed from homepage. */}
    </>
  );
} 