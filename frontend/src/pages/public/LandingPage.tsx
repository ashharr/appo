import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PUBLIC_ROUTES } from '@/constants/routes';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate(PUBLIC_ROUTES.LOGIN);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Appo
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your comprehensive appointment scheduling platform
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleLoginClick}
          sx={{ mt: 3 }}
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default LandingPage;
