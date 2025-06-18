import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';


createRoot(document.getElementById('root')).render(
  <MantineProvider defaultColorScheme="dark">
    <Notifications />
    <StrictMode>
      <App />
    </StrictMode>
  </MantineProvider>
)
