import React, { useState, useEffect } from 'react';
import { Card, Center, Text, Button } from '@mantine/core';

function ImageCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { src: '/spacex.png', alt: 'SpaceX' },
    { src: '/nasa.png', alt: 'NASA' },
    { src: '/ncsa.png', alt: 'NCSA' },
    { src: '/blue.png', alt: 'Blue Origin' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

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
        padding: '20px',
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
            marginBottom: '20px',
          }}
        >
          Built by engineers from
        </Text>
      </Center>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80px',
          position: 'relative',
        }}
      >
        <Button
          onClick={handlePrev}
          style={{
            position: 'absolute',
            left: 0,
            backgroundColor: 'transparent',
            border: 'none',
            zIndex: 10,
          }}
        >
          &#8592;
        </Button>

        <img
          src={slides[currentSlide].src}
          alt={slides[currentSlide].alt}
          style={{
            filter: 'grayscale(100%)',
            maxWidth: '120px',
            maxHeight: '60px',
            opacity: 0.7,
            objectFit: 'contain',
            transition: 'opacity 0.5s ease-in-out',
          }}
          onError={(e) => {
            console.log(`Failed to load: ${slides[currentSlide].src}`);
            e.target.style.display = 'none';
          }}
        />

        <Button
          onClick={handleNext}
          style={{
            position: 'absolute',
            right: 0,
            backgroundColor: 'transparent',
            border: 'none',
            zIndex: 10,
          }}
        >
          &#8594;
        </Button>
      </div>
    </Card>
  );
}

export default ImageCarousel;
