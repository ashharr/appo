import React from 'react';
import { Container, Typography, Box, Card, CardContent } from '@mui/material';

const LoginPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
              Sign In to Appo
            </Typography>
            <Typography variant="body1" textAlign="center" color="text.secondary" paragraph>
              Login functionality will be implemented in Phase 2
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LoginPage;
