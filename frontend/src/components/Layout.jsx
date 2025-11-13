import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  CssBaseline,
  createTheme,
  ThemeProvider
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ffffff' },
    background: {
      default: '#000000',
      paper: '#111111',
    },
    text: {
      primary: '#ffffff',
      secondary: '#888888',
    },
  },
  typography: {
    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h6: {
      fontWeight: 500,
      fontSize: '1.1rem',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundImage: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16
        }
      }
    }
  }
});

export default function Layout({ children, title = 'StreamConnect' }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100vw',
          overflowX: 'hidden',
          backgroundColor: 'background.default',
        }}
      >
        {/* Header */}
        <AppBar position="static" elevation={0}>
          <Toolbar
            variant="dense"
            sx={{
              minHeight: 60,
              px: { xs: 2, sm: 4 },
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#00ff88',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.3 },
                  },
                }}
              />
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: 500, color: 'text.primary', letterSpacing: '-0.01em' }}
              >
                {title}
              </Typography>
            </Box>
            <IconButton
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            width: '100%',
            px: 0,
            backgroundColor: 'background.default',
          }}
        >
          {children}
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 2,
            px: { xs: 2, sm: 4 },
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: '#666666', fontSize: '0.75rem', fontWeight: 400 }}
          >
            © 2025 StreamConnect
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
