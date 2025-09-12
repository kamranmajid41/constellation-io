import { Image, Box, Card, Center, Text } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';

function ImageCarousel() {
  const autoplay = useRef(Autoplay({ delay: 2500 }));

  return (
    <Card
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        zIndex: 100,
        position: 'absolute',
        top: 230,
        width: '90%',
        maxWidth: 600,
        height: 150,  
        padding: '0',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      }}
      radius="lg"
    >
      <Center>
        <Text
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 500,
            fontSize: '1rem',
            background: 'linear-gradient(45deg, var(--mantine-color-lime-3) 0%, var(--mantine-color-cyan-3) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '2rem',
          }}
        >
          Built by engineers from
        </Text>
      </Center>

      <Carousel
        slideSize="40%" 
        emblaOptions={{ loop: true}}
        plugins={[autoplay.current]}
        height="90%"  
        withIndicators={false} 
        withControls={false}  
        align="center"
      >
        {[
          { src: '/spacex.png', alt: 'SpaceX' },
          { src: '/nasa.png', alt: 'NASA' },
          { src: '/ncsa.png', alt: 'NCSA' },
          { src: '/blue.png', alt: 'Blue Origin' },
        ].map((item, index) => (
          <Carousel.Slide key={index}>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '90%',
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fit="contain"  
                style={{
                  filter: 'grayscale(100%)',
                  maxWidth: '80%',  
                  maxHeight: '80%', 
                }}
              />
            </Box>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Card>
  );
}

export default ImageCarousel;
