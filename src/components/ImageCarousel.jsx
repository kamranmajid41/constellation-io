import { Image, Box, Group, Text, Card, Stack, Center } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';

function ImageCarousel() {
  

  return (
    <Card
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)', // Added border
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // Added shadow
        zIndex: 100,
        position: 'absolute',
        top: 230,
        height: 150,
        width: 700,
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
      }}
      radius='lg'
    >
      <Center>
         <Text
        style={{
            fontFamily: 'Orbitron, sans-serif', 
            fontWeight: 50,
            fontSize: '1rem', 
            background: 'linear-gradient(45deg, var(--mantine-color-lime-3) 0%, var(--mantine-color-cyan-3) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        }}
      >
      Built by engineers from
    </Text>
      </Center>


    <Group justify='center'
    style={{
      position:'relative', 
      top:-50
    }}>
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Image
          src='public/spacex.png'
          alt='SpaceX'
          w={200}
          h={200}
          fit="contain"
          style={{ filter: 'grayscale(100%)' }}
        />
      </Box>

      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Image
          src='public/nasa.png'
          alt='NASA'
          w={100}
          h={100}
          fit="contain"
          style={{ filter: 'grayscale(100%)' }}
        />
      </Box>

      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Image
          src='public/ncsa.png'
          alt='NCSA'
          w={200}
          h={200}
          fit="contain"
          style={{ filter: 'grayscale(100%)' }}
        />
      </Box>
    </Group>
    </Card>
  );
}

export default ImageCarousel;