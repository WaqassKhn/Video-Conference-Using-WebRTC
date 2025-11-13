// src/pages/Profile.js
import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  IconButton,
  Grid,
  CssBaseline,
  Stack
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Logout as LogoutIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  LocationOn,
  CalendarToday
} from '@mui/icons-material';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: { main: '#00695c', contrastText: '#fff' },
    secondary: { main: '#ffb300', contrastText: '#000' },
    background: { default: '#f5f5f5', paper: '#fff' }
  },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'sans-serif'].join(','),
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: 0 } } }
  }
});

export const Profile = () => {
  const [user, setUser] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    bio: 'Loves video chats and coding!',
    location: 'San Francisco, CA',
    joined: 'January 2023'
  });
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(user);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => { setUser(form); setEditMode(false); };
  const handleLogout = () => { console.log('Logging out...'); };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: 'background.default',
          width: '100vw',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <Paper
          sx={{
            width: '100vw',
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 3,
            borderRadius: 0,
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 160,
              bgcolor: 'primary.main',
              backgroundImage: 'linear-gradient(135deg, #00695c 0%, #004d40 100%)',
              zIndex: 0
            },
            p: { xs: 2, md: 4 },
          }}
        >
          {/* Logout button */}
          <IconButton
            onClick={handleLogout}
            color="secondary"
            size="large"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': { bgcolor: 'background.default' }
            }}
          >
            <LogoutIcon />
          </IconButton>

          {/* Header */}
          <Box sx={{ position: 'relative', textAlign: 'center', mb: 8 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                border: '4px solid #fff',
                zIndex: 1,
                bgcolor: 'primary.main'
              }}
            >
              {user.name.charAt(0)}
            </Avatar>
            <Typography variant="h4" sx={{ mt: 2 }}>{user.name}</Typography>
            <Typography color="text.secondary" sx={{ mb: 1 }}>{user.email}</Typography>
            <Stack direction="row" justifyContent="center" spacing={4} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn color="primary" sx={{ mr: 1 }} />{user.location}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday color="primary" sx={{ mr: 1 }} />Member since: {user.joined}
              </Box>
            </Stack>
          </Box>

          {/* Content */}
          <Grid container spacing={4} sx={{ width: '100%', m: 0 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ mb: 2 }}>About Me</Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  variant="outlined"
                />
              ) : (
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, minHeight: 120, display: 'flex', alignItems: 'center' }}>
                  <Typography>{user.bio}</Typography>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ mb: 2 }}>Personal Info</Typography>
              <Stack spacing={2}>
                {['name', 'email'].map((field) => (
                  <Box key={field} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {field === 'name' ? 'Full Name' : 'Email Address'}
                      </Typography>
                      {editMode ? (
                        <TextField
                          fullWidth
                          name={field}
                          value={form[field]}
                          onChange={handleChange}
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                        />
                      ) : (
                        <Typography>{user[field]}</Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 3, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                {editMode ? (
                  <>
                    <Button variant="outlined" startIcon={<CloseIcon />} onClick={() => setEditMode(false)} sx={{ mr: 2 }}>Cancel</Button>
                    <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>Save Changes</Button>
                  </>
                ) : (
                  <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditMode(true)}>Edit Profile</Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};
