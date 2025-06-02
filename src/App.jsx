import { useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AppShell, Group, Text } from '@mantine/core';
import Globe from './components/Globe'; 

function App() {
  return (
    <>
      <Globe/>
    </>
  );
}

export default App;
