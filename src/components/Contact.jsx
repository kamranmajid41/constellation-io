import React, { useState } from 'react';
import { Box, Container, Title, Text, Stack, TextInput, Textarea, Button, Group, Notification, Anchor } from '@mantine/core';
import { IconAt, IconSend } from '@tabler/icons-react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState(null); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);

    setTimeout(() => {
      setFormStatus('success');
      setFormData({ 
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setTimeout(() => setFormStatus(null), 5000); 
    }, 1000);

   
  };

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
      <Container size="sm" py="xl">
        {/* Contact Page Title */}
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
          Contact us
        </Title>

        {/* Introduction Section */}
        <Text size="lg" align="center" mb="xl" style={{ maxWidth: '600px', margin: '0 auto 2rem auto', opacity: 0.8 }}>
          Have questions about our AI-powered connectivity solutions, partnership opportunities, or just want to say hello? We'd love to hear from you!
        </Text>

        {formStatus === 'success' && (
          <Notification title="Success!" color="green" onClose={() => setFormStatus(null)} style={{ marginBottom: '1rem' }}>
            Your message has been sent successfully. We will get back to you soon!
          </Notification>
        )}
        {formStatus === 'error' && (
          <Notification title="Error!" color="red" onClose={() => setFormStatus(null)} style={{ marginBottom: '1rem' }}>
            There was an error sending your message. Please try again later.
          </Notification>
        )}

        {/* Contact Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            boxShadow: 'inset 0 0 8px rgba(255, 255, 255, 0.2), 0 4px 30px rgba(0, 0, 0, 0.1)', 
            borderRadius: '10px',
            padding: '2rem',
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto',
          }}
        >
          <Stack spacing="lg">
            <TextInput
              label="Your Name"
              placeholder="John Doe"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              styles={{
                input: {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&::placeholder': { color: 'rgba(255, 255, 255, 0.6)' },
                },
                label: { color: 'white', opacity: 0.9 },
              }}
            />
            <TextInput
              label="Your Email"
              placeholder="you@example.com"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              styles={{
                input: {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&::placeholder': { color: 'rgba(255, 255, 255, 0.6)' },
                },
                label: { color: 'white', opacity: 0.9 },
              }}
            />
            <TextInput
              label="Subject"
              placeholder="Inquiry about services..."
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              styles={{
                input: {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&::placeholder': { color: 'rgba(255, 255, 255, 0.6)' },
                },
                label: { color: 'white', opacity: 0.9 },
              }}
            />
            <Textarea
              label="Your Message"
              placeholder="Type your message here..."
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              minRows={5}
              styles={{
                input: {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&::placeholder': { color: 'rgba(255, 255, 255, 0.6)' },
                },
                label: { color: 'white', opacity: 0.9 },
              }}
            />
            <Group position="right" mt="md">
              <Button
                type="submit"
                variant="gradient"
                gradient={{ from: 'lime', to: 'cyan' }}
                leftIcon={<IconSend size={18} />}
                size="md"
                style={{
                  boxShadow: '0 4px 15px rgba(0, 255, 255, 0.3)', 
                  borderRadius: '8px',
                  fontFamily: 'Orbitron, sans-serif',
                }}
              >
                Send Message
              </Button>
            </Group>
          </Stack>
        </Box>

        {/* Additional Contact Information */}
        <Stack align="center" mt="xl" spacing="md">
          <Text size="md" c="dimmed" style={{ opacity: 0.8 }}>
            Prefer to reach out directly?
          </Text>
          <Group spacing="xs">
            <IconAt size={20} color="var(--mantine-color-cyan-3)" />
            <Anchor href="mailto:info@constellation-io.com" c="cyan" size="md">
              info@constellation-io.com
            </Anchor>
          </Group>
        </Stack>

      </Container>
    </Box>
  );
}

export default Contact;
