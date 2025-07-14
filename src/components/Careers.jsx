import React from 'react';
import { Box, Title, Text } from '@mantine/core';

export default function Careers() {
  return (
    <Box style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '96px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Box style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <Title order={1} style={{ fontWeight: 700, fontSize: '2.8rem', marginBottom: 24, color: '#fff', letterSpacing: '-1px', lineHeight: 1.1 }}>
          Join our team at Constellation-io
        </Title>

        <Text size="md" style={{ color: '#b2f0ea', marginBottom: 0 }}>
          For future opportunities, you can email us at <a href="mailto:careers@constellation-io.com" style={{ color: '#2aa9a8', textDecoration: 'underline' }}>careers@constellation-io.com</a>.
        </Text>
      </Box>
    </Box>
  );
} 