import React from 'react';
import { Box, Container, Title, Text, Stack, SimpleGrid, Card, Image, Group, ThemeIcon } from '@mantine/core';
import { IconRocket, IconStar, IconWorld} from '@tabler/icons-react'; // Example icons, adjust as needed

function About() {
  return (
    <Box
      style={{
        minHeight: 'calc(100vh - 100px)',
        backgroundColor: '#1a1a1a', 
        color: 'white', 
        padding: '4rem 0', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflowY: 'auto', 
      }}
    >
      <Container size="lg" py="xl">
        {/* About Page Title */}
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
          About constellation-io
        </Title>

        {/* Introduction Section */}
        <Text size="lg" align="center" mb="xl" style={{ maxWidth: '800px', margin: '0 auto 2rem auto', opacity: 0.8 }}>
          At constellation-io, we believe that the hardest problems in space can be solved here on Earth. By leveraging AI tools to optimize vehicle-to-ground connectivity, 
          we ensure that you always receive the cheapest, most reliable service that's physically possible. And we can prove it!
        </Text>

        {/* Mission, Vision, Values Section */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" mt="xl">
          {/* Mission Card */}
          <Card shadow="sm" padding="lg" radius="md" withBorder
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <Stack align="center" spacing="md">
              <ThemeIcon variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} size="xl" radius="xl">
                <IconRocket style={{ width: '70%', height: '70%' }} stroke={1.5} />
              </ThemeIcon>
              <Title order={3} align="center" c="white">Our Mission</Title>
              <Text size="sm" align="center" c="dimmed">
                Our mission is to give you the most accurate view of backhaul path connectivity on Earth, 
                and AI powered simulations that create a link-budget that best suits your specific use-case. 
              </Text>
            </Stack>
          </Card>

          {/* Vision Card */}
          <Card shadow="sm" padding="lg" radius="md" withBorder
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <Stack align="center" spacing="md">
              <ThemeIcon variant="gradient" gradient={{ from: 'indigo', to: 'purple' }} size="xl" radius="xl">
                <IconStar style={{ width: '70%', height: '70%' }} stroke={1.5} />
              </ThemeIcon>
              <Title order={3} align="center" c="white">Our Vision</Title>
              <Text size="sm" align="center" c="dimmed">
                There are more than 10,000 satellites in orbit - and thousands of ground stations all around the globe. 
                Connecting these in a large data model gives you, the customer, the best price and connectivity. 
              </Text>
            </Stack>
          </Card>

          {/* Values Card */}
          <Card shadow="sm" padding="lg" radius="md" withBorder
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <Stack align="center" spacing="md">
              <ThemeIcon variant="gradient" gradient={{ from: 'teal', to: 'lime' }} size="xl" radius="xl">
                <IconWorld style={{ width: '70%', height: '70%' }} stroke={1.5} />
              </ThemeIcon>
              <Title order={3} align="center" c="white">Our Values</Title>
              <Text size="sm" align="center" c="dimmed">
                Innovation, Integrity, Collaboration, and Impact. We are committed to pushing boundaries responsibly
                and working together to make a positive, lasting impact on the future of space technology. 
              </Text>
            </Stack>
          </Card>
        </SimpleGrid>

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
          Our Team
        </Title>
        <Text size="lg" align="center" mb="xl" style={{ maxWidth: '700px', margin: '0 auto 2rem auto', opacity: 0.8 }}>
          Behind constellation-io is a dedicated group of aerospace engineers, software developers, and visionaries, united by a passion for exploring the final frontier.
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">

          <Card shadow="sm" padding="lg" radius="md" withBorder
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <Stack align="center" spacing="sm">
              <Image
                src='public/kam_headshot.jpeg'
                alt="Team Member 1"
                radius="50%"
                width={120}
                height={300}
                style={{ objectFit: 'cover' }}
              />
              <Title order={4} c="white">Kamran Majid</Title>
              <Text size="sm" c="dimmed">CEO & Founder</Text>
              <Text size="xs" align="center" c="dimmed" opacity={0.7}>
                Ex. SpaceX, NASA. Built algorithms optimizing connectivity for Starship, F9, Dragon, and Starlink to the ground. 
              </Text>
            </Stack>
          </Card>

          {/* Example Team Member Card 2 */}
          <Card shadow="sm" padding="lg" radius="md" withBorder
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <Stack align="center" spacing="sm">
              <Image
                src="public/spongebob.avif"
                alt="Team Member 2"
                radius="50%"
                width={120}
                height={300}
                style={{ objectFit: 'cover' }}
              />
              <Title order={4} c="white">Sponge Bob</Title>
              <Text size="sm" c="dimmed">CTO</Text>
              <Text size="xs" align="center" c="dimmed" opacity={0.7}>
                Grill-master, works at the Krusty-Krabs. 
              </Text>
            </Stack>
          </Card>

           {/* Example Team Member Card 3 */}
          <Card shadow="sm" padding="lg" radius="md" withBorder
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <Stack align="center" spacing="sm">
              <Image
                src="public/squidward.jpg"
                alt="Team Member 3"
                radius="50%"
                width={120}
                height={300}
                style={{ objectFit: 'cover' }}
              />
              <Title order={4} c="white">Squid Ward</Title>
              <Text size="sm" c="dimmed">Head of Operations</Text>
              <Text size="xs" align="center" c="dimmed" opacity={0.7}>
                Cashier, works at the Krusty-Krabs. 
              </Text>
            </Stack>
          </Card>

        </SimpleGrid>

        {/* Final Call to Action / Closing Statement */}
        <Text size="lg" align="center" mt="xl" style={{ maxWidth: '800px', margin: '2rem auto 0 auto', opacity: 0.8 }}>
        Join us in connecting Earth to space. 
        </Text>
      </Container>
    </Box>
  );
}

export default About;
