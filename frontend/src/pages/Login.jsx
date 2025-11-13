// src/pages/Login.js
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  Divider,
  Grid,
  CssBaseline
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#00695c', contrastText: '#fff' },
    secondary: { main: '#ffb300', contrastText: '#000' },
    background: { default: '#f5f5f5', paper: '#fff' }
  },
  typography: {
    fontFamily: ['Inter','Roboto','sans-serif'].join(','),
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  components: {
    MuiButton:    { styleOverrides: { root: { borderRadius: 12 } } },
    MuiPaper:     { styleOverrides: { root: { borderRadius: 16 } } },
    MuiLink:      { defaultProps:  { underline: 'hover' } }
  }
});

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', confirmPassword: ''
  });

  const handleChange = e =>
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>

      <Box sx={{ 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}>
        <Grid container sx={{ 
          maxWidth: 1200, 
          height: '80vh', 
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: 3
        }}>

          {/* Left graphic & copy */}
          <Grid
            item xs={false} md={6}
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #00695c 0%, #004d40 100%)',
              color: 'common.white'
            }}
          >
            <Box sx={{ textAlign: 'center', width: '80%', maxWidth: 400, p: 4 }}>
              <Typography variant="h3" sx={{ mb: 2 }}>
                {isLogin ? 'Welcome Back!' : 'Join Us Today'}
              </Typography>
              <Typography>
                {isLogin
                  ? 'Sign in to access your personalized dashboard and features.'
                  : 'Create an account to get started with our amazing services.'}
              </Typography>
            </Box>
          </Grid>

          {/* Right form */}
          <Grid
            item xs={12} md={6}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: { xs: 2, sm: 4 },
              backgroundColor: 'background.paper',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {isLogin ? (
              <Paper elevation={0} sx={{ 
                width: '100%', 
                maxWidth: 400, 
                p: { xs: 3, sm: 4 },
                bgcolor: 'transparent',
                boxShadow: 'none'
              }}>
                <Typography variant="h4" align="center" sx={{ mb: 3 }}>
                  Sign In
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit}>
                  <TextField
                    fullWidth 
                    required 
                    name="email" 
                    label="Email Address"
                    value={formData.email} 
                    onChange={handleChange}
                    autoComplete="email" 
                    autoFocus 
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth 
                    required 
                    name="password" 
                    type="password" 
                    label="Password"
                    value={formData.password} 
                    onChange={handleChange}
                    autoComplete="current-password" 
                    sx={{ mb: 3 }}
                  />
                  <Button
                    type="submit" 
                    fullWidth 
                    variant="contained" 
                    color="primary"
                    sx={{ py: 1.5, mb: 3 }}
                  >
                    Sign In
                  </Button>
                  <Divider sx={{ mb: 3 }}>OR</Divider>
                  <Box sx={{ textAlign: 'center', mb: 1 }}>
                    <MuiLink component="button" variant="body2">
                      Forgot password?
                    </MuiLink>
                  </Box>
                  <Typography variant="body2" align="center">
                    Don’t have an account?{' '}
                    <MuiLink component="button" onClick={() => setIsLogin(false)}>
                      Sign Up
                    </MuiLink>
                  </Typography>
                </Box>
              </Paper>
            ) : (
              <Paper elevation={0} sx={{ 
                width: '100%', 
                maxWidth: 400, 
                p: { xs: 3, sm: 4 },
                bgcolor: 'transparent',
                boxShadow: 'none'
              }}>
                <Typography variant="h4" align="center" sx={{ mb: 3 }}>
                  Create Account
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit}>
                  <TextField
                    fullWidth 
                    required 
                    name="name" 
                    label="Full Name"
                    value={formData.name} 
                    onChange={handleChange}
                    autoComplete="name" 
                    autoFocus 
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth 
                    required 
                    name="email" 
                    label="Email Address"
                    value={formData.email} 
                    onChange={handleChange}
                    autoComplete="email" 
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth 
                    required 
                    name="password" 
                    type="password" 
                    label="Password"
                    value={formData.password} 
                    onChange={handleChange} 
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth 
                    required 
                    name="confirmPassword" 
                    type="password" 
                    label="Confirm Password"
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    sx={{ mb: 3 }}
                  />
                  <Button
                    type="submit" 
                    fullWidth 
                    variant="contained" 
                    color="primary"
                    sx={{ py: 1.5, mb: 3 }}
                  >
                    Sign Up
                  </Button>
                  <Divider sx={{ mb: 3 }}>OR</Divider>
                  <Typography variant="body2" align="center">
                    Already have an account?{' '}
                    <MuiLink component="button" onClick={() => setIsLogin(true)}>
                      Sign In
                    </MuiLink>
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};