import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';


createRoot(document.getElementById('root')).render(
  <MantineProvider defaultColorScheme="dark">
    <Notifications />
    <StrictMode>
      <BrowserRouter basename={import.meta.env.PROD && window.location.hostname.includes('vercel') ? '/' : '/constellation-io'}>
        <App />
      </BrowserRouter>
    </StrictMode>
  </MantineProvider>
)
