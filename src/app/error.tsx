'use client';

import { useEffect } from 'react';
import { Box, Button, Typography, Container } from '@mui/material';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Something went wrong
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          We encountered an unexpected error. Please try again.
        </Typography>
        <Button
          variant="contained"
          onClick={reset}
          sx={{ mt: 2 }}
        >
          Try again
        </Button>
      </Box>
    </Container>
  );
}
