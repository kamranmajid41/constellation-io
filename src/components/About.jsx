import React from 'react';
import { Box, Container, Title, Text, Stack, SimpleGrid, Card, Image, Group, ThemeIcon } from '@mantine/core';
import { IconRocket, IconStar, IconWorld, IconFileText, IconBrandLinkedin } from '@tabler/icons-react';

function About() {
  return (
    <Box
      style={{
        backgroundColor: '#1a1a1a',
        color: 'white',
        padding: '4rem 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflowY: 'auto',
        height: '100vh',
        width: '100vw',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    >
      <Container size="lg" py="xl">
        {/* Main Heading: Focus on disruption and future */}
        <Title
          order={1}
          align="center"
          mb="xl"
          style={{
            fontWeight: 700,
            fontSize: '3rem',
            background: 'linear-gradient(45deg, var(--mantine-color-lime-3) 0%, var(--mantine-color-cyan-3) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Orbitron, sans-serif',
          }}
        >
          Pioneering the future of space connectivity
        </Title>

        {/* Introduction: Problem, solution, and early-stage potential */}
        <Text size="lg" align="center" mb="xl" style={{ maxWidth: '800px', margin: '0 auto 2rem auto', opacity: 0.8 }}>
          We are tackling the critical challenge of <span className="font-bold">unreliable space telecommunication</span>. Our <span className="font-bold">novel AI platform</span>, built on <span className="font-bold">advanced graph theory</span>, is designed to create <span className="font-bold">self-healing, self-optimizing space-terrestrial networks</span>. This groundbreaking approach will deliver <span className="font-bold">unparalleled high-capacity, low-latency, and resilient data transfer</span>, crucial for emerging applications in defense, IoT, and remote operations. 
        </Text>

        <Title
          order={4}
          align="center"
          mt="xl"
          mb="lg"
          style={{
            background: 'linear-gradient(45deg, var(--mantine-color-lime-3) 0%, var(--mantine-color-cyan-3) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Orbitron, sans-serif',
          }}
        >
        We are building the next generation of global connectivity.
        </Title>


        {/* Mission, Vision, Principles: Focused on foundational goals and impact */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" mt="xl">
          <Card shadow="sm" padding="lg" radius="md" withBorder
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <Stack align="center" spacing="md">
              <ThemeIcon variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} size="xl" radius="xl">
                <IconRocket style={{ width: '70%', height: '70%' }} stroke={1.5} />
              </ThemeIcon>
              <Title order={3} align="center" c="white">Our Mission</Title>
              <Text size="sm" align="center" c="dimmed">
                To establish the benchmark for <span className="font-bold">resilient, cost-effective communication pathways</span>, solving the reliability gaps in space connectivity. We leverage pioneering graph theory and AI to ensure <span className="font-bold">unparalleled service reliability</span>, creating value for critical applications across sectors.
              </Text>
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <Stack align="center" spacing="md">
              <ThemeIcon variant="gradient" gradient={{ from: 'indigo', to: 'purple' }} size="xl" radius="xl">
                <IconStar style={{ width: '70%', height: '70%' }} stroke={1.5} />
              </ThemeIcon>
              <Title order={3} align="center" c="white">Our Vision</Title>
              <Text size="sm" align="center" c="dimmed">
                To build the <span className="font-bold">adaptive global network</span>, seamlessly integrating future satellite and terrestrial infrastructure into an <span className="font-bold">intelligent, self-optimizing fabric</span>. Our vision aims to set the new industry standard for real-time, resilient telecommunications.
              </Text>
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <Stack align="center" spacing="md">
              <ThemeIcon variant="gradient" gradient={{ from: 'teal', to: 'lime' }} size="xl" radius="xl">
                <IconWorld style={{ width: '70%', height: '70%' }} stroke={1.5} />
              </ThemeIcon>
              <Title order={3} align="center" c="white">Our Principles</Title>
              <Text size="sm" align="center" c="dimmed">
                Innovation, Rigor, Collaboration, and Impact define our commitment to responsible disruption and scientific excellence. We leverage diverse expertise for transformative solutions, redefining space technology and global access.
              </Text>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Technical Foundations: Emphasize novel research and foundational IP */}
        <Title
          order={2}
          align="center"
          mt="xl"
          mb="lg"
          style={{
            background: 'linear-gradient(45deg, var(--mantine-color-lime-3) 0%, var(--mantine-color-cyan-3) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Orbitron, sans-serif',
          }}
        >
          Novel Technology & Foundational IP
        </Title>
        <Text size="lg" align="center" mb="xl" style={{ maxWidth: '700px', margin: '0 auto 2rem auto', opacity: 0.8 }}>
          Our distinct advantage is built on <span className="font-bold">groundbreaking research and developing patented methodologies</span>. Constellation-io's unique integration of <span className="font-bold">graph theory for resilient network modeling</span> and <span className="font-bold">AI for predictive dynamic optimization</span> represents a profound advancement set to disrupt space telecommunications.
        </Text>

        {/* Papers remain as is, linking to validation of core concepts */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl" style={{ maxWidth: '100vw', margin: '0 auto' }}>
          {/* Your Original Paper Card */}
          <Card shadow="sm" padding="lg" radius="md" withBorder
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <Group noWrap>
              <ThemeIcon variant="gradient" gradient={{ from: 'grape', to: 'pink' }} size="lg" radius="md">
                <IconFileText style={{ width: '60%', height: '60%' }} stroke={1.5} />
              </ThemeIcon>
              <Stack spacing={4}>
                <Title order={4} c="white">"Graph-Theoretic AI for Global Connectivity"</Title>
                <Text size="sm" c="dimmed">
                  By K. Majid. MDPI, Electronics.
                </Text>
                <Text size="sm"><a href="https://drive.google.com/file/d/1Vz6glzOfYwdiuNvSKZYZ7nkEepOwprf2/view?usp=sharing" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--mantine-color-cyan-3)', textDecoration: 'none' }}>Read the full paper here</a></Text>
              </Stack>
            </Group>
          </Card>

          {/* Real Paper Card 1: AI in Satellite Networks */}
          <Card shadow="sm" padding="lg" radius="md" withBorder
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <Group noWrap>
              <ThemeIcon variant="gradient" gradient={{ from: 'orange', to: 'red' }} size="lg" radius="md">
                <IconFileText style={{ width: '60%', height: '60%' }} stroke={1.5} />
              </ThemeIcon>
              <Stack spacing={4}>
                <Title order={4} c="white">"Intelligent Resource Management for Satellite and Terrestrial Spectrum Shared Networking toward B5G"</Title>
                <Text size="sm" c="dimmed">
                  By M. Jia, Z. Ximu. IEEE Wireless Communications, 2020.
                </Text>
                <Text size="sm">
                  <a href="https://www.researchgate.net/publication/339701134_Intelligent_Resource_Management_for_Satellite_and_Terrestrial_Spectrum_Shared_Networking_toward_B5G" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--mantine-color-cyan-3)', textDecoration: 'none' }}>Read the full paper here</a>
                </Text>
              </Stack>
            </Group>
          </Card>

          {/* Real Paper Card 2: Graph Theory for Network Design */}
          <Card shadow="sm" padding="lg" radius="md" withBorder
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <Group noWrap>
              <ThemeIcon variant="gradient" gradient={{ from: 'green', to: 'lime' }} size="lg" radius="md">
                <IconFileText style={{ width: '60%', height: '60%' }} stroke={1.5} />
              </ThemeIcon>
              <Stack spacing={4}>
                <Title order={4} c="white">"Robustness of satellite constellation networks"</Title>
                <Text size="sm" c="dimmed">
                  By X. Xu, Z. Gao, A. Liu. Computer Communications, 2023.
                </Text>
                <Text size="sm">
                  <a href="https://doi.org/10.1016/j.comcom.2023.07.036" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--mantine-color-cyan-3)', textDecoration: 'none' }}>Read the full paper here</a>
                </Text>
              </Stack>
            </Group>
          </Card>
        </SimpleGrid>

        {/* Team Section: Emphasize foundational expertise and vision to build */}
        <Title
          order={2}
          align="center"
          mt="xl"
          mb="lg"
          style={{
            background: 'linear-gradient(45deg, var(--mantine-color-lime-3) 0%, var(--mantine-color-cyan-3) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Orbitron, sans-serif',
          }}
        >
          Founding Team
        </Title>
        <Text size="lg" align="center" mb="xl" style={{ maxWidth: '700px', margin: '0 auto 2rem auto', opacity: 0.8 }}>
          We are driven by a <span className="font-bold">dedicated founding team</span> with deep expertise across aerospace, software engineering, and strategic operations. Our collective experience and passion position us to execute on this ambitious vision.
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
          <Card shadow="sm" padding="lg" radius="md" withBorder
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <Stack align="center" spacing="sm">
              <Image
                src='/constellation-io/kam_headshot.jpeg'
                alt="Kamran Majid"
                radius="50%"
                width={120}
                height={300}
                style={{ objectFit: 'cover' }}
              />
              <Group spacing="xs" mt="md"> 
                <Title order={4} c="white" style={{ margin: 0 }}>Kamran Majid</Title>
                <a href="https://www.linkedin.com/in/kamran-majid-0571121b0/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <IconBrandLinkedin size={20} color="white" />
                </a>
              </Group>
              <Text size="sm" c="dimmed">CEO & Founder</Text>
              <Text size="xs" align="center" c="dimmed" opacity={0.7}>
                Ex. SpaceX, NASA. Built algorithms optimizing connectivity for Starship, F9, Dragon, and Starlink to ground nodes.
              </Text>
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <Stack align="center" spacing="sm">
              <Image
                src="/constellation-io/raaid.jpeg"
                alt="Raaid Kabir"
                radius="50%"
                width={120}
                height={300}
                style={{ objectFit: 'cover' }}
              />
              <Group spacing="xs" mt="md"> 
                <Title order={4} c="white" style={{ margin: 0 }}>Raaid Kabir</Title>
                <a href="https://www.linkedin.com/in/raaid-kabir/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <IconBrandLinkedin size={20} color="white" />
                </a>
              </Group>              
              <Text size="sm" c="dimmed">CTO</Text>
              <Text size="xs" align="center" c="dimmed" opacity={0.7}>
                Ex. Blue Origin, Capital One. Verification Infrastructure for New Glenn. Owned software for the Power Conditioning Module's chassis tester.
              </Text>
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <Stack align="center" spacing="sm">
              <Image
                src="/constellation-io/omeed.jpeg"
                alt="Omeed Tehrani"
                radius="50%"
                width={120}
                height={300}
                style={{ objectFit: 'cover' }}
              />
              <Group spacing="xs" mt="md"> 
                <Title order={4} c="white" style={{ margin: 0 }}>Omeed Tehrani</Title>
                <a href="https://www.linkedin.com/in/omeedtehrani/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <IconBrandLinkedin size={20} color="white" />
                </a>
              </Group>   
              <Text size="sm" c="dimmed">Head of Operations</Text>
              <Text size="xs" align="center" c="dimmed" opacity={0.7}>
                Ex. Capital One. Leveraged LLMs to build infrastructure tooling for strategic operations. 
              </Text>
            </Stack>
          </Card>
        </SimpleGrid>
        <Text size="lg" align="center" mt="xl" style={{ maxWidth: '800px', margin: '2rem auto 0 auto', opacity: 0.8 }}>
          Join us as we build the future of space communication. 
        </Text>
      </Container>
    </Box>
  );
}

export default About;
