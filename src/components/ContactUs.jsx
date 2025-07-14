import React, { useState } from 'react';
import { Box, Title, Text, TextInput, Textarea, Button, Group, Grid } from '@mantine/core';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setTimeout(() => {
      setStatus('success');
      setForm({ name: '', company: '', phone: '', email: '', message: '' });
      setTimeout(() => setStatus(null), 4000);
    }, 1000);
  };

  return (
    <Box style={{ minHeight: '100vh', background: '#fff', color: '#111', padding: '96px 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
      <Box style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <Title order={1} style={{ fontWeight: 700, fontSize: '3.2rem', marginBottom: 24, color: '#111', letterSpacing: '-1px', lineHeight: 1.1, textAlign: 'left' }}>
          Get in our orbit
        </Title>
        <Text size="md" style={{ color: '#111', marginBottom: 4, textAlign: 'left' }}>
          For media inquiries, reach out to <a href="mailto:media@constellation-io.com" style={{ color: '#111', textDecoration: 'underline' }}>media@constellation-io.com</a>
        </Text>
        <Text size="md" style={{ color: '#111', marginBottom: 40, textAlign: 'left' }}>
          For commercial inquiries, contact <a href="mailto:sales@constellation-io.com" style={{ color: '#111', textDecoration: 'underline' }}>sales@constellation-io.com</a>
        </Text>
        <Box component="form" onSubmit={handleSubmit} style={{ width: '100%', marginTop: 24 }}>
          <Grid gutter={32}>
            <Grid.Col span={6}>
              <TextInput
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                styles={{ input: { border: 'none', borderBottom: '2px solid #bbb', borderRadius: 0, fontSize: 20, color: '#111', background: 'transparent', marginBottom: 32 }, placeholder: { color: '#bbb' } }}
                autoComplete="off"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                name="company"
                placeholder="Company"
                value={form.company}
                onChange={handleChange}
                styles={{ input: { border: 'none', borderBottom: '2px solid #bbb', borderRadius: 0, fontSize: 20, color: '#111', background: 'transparent', marginBottom: 32 }, placeholder: { color: '#bbb' } }}
                autoComplete="off"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                styles={{ input: { border: 'none', borderBottom: '2px solid #bbb', borderRadius: 0, fontSize: 20, color: '#111', background: 'transparent', marginBottom: 32 }, placeholder: { color: '#bbb' } }}
                autoComplete="off"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                styles={{ input: { border: 'none', borderBottom: '2px solid #bbb', borderRadius: 0, fontSize: 20, color: '#111', background: 'transparent', marginBottom: 32 }, placeholder: { color: '#bbb' } }}
                autoComplete="off"
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                name="message"
                placeholder="Message"
                value={form.message}
                onChange={handleChange}
                minRows={4}
                styles={{ input: { border: 'none', borderBottom: '2px solid #bbb', borderRadius: 0, fontSize: 20, color: '#111', background: 'transparent', marginBottom: 32, resize: 'none' }, placeholder: { color: '#bbb' } }}
                autoComplete="off"
              />
            </Grid.Col>
          </Grid>
          <Button type="submit" color="#2aa9a8" radius="md" style={{ marginTop: 24, fontWeight: 500, fontSize: 18, padding: '0.1em 2.5em' }}>Send</Button>
          {status === 'success' && (
            <Text align="left" color="green" style={{ marginTop: 16 }}>Your message has been sent!</Text>
          )}
        </Box>
      </Box>
    </Box>
  );
} 