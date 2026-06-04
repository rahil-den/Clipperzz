import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Typography, Container } from '@mui/material';
import theme from './theme';
import HomePage from './pages/HomePage';
import ProcessingPage from './pages/ProcessingPage';
import ResultPage from './pages/ResultPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0A0A0F 0%, #13131A 50%, #0A0A0F 100%)' }}>
        {/* Header */}
        <Box sx={{ py: 3, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #A78BFA 0%, #22D3EE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            ✂️ Clipperz
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.500', mt: 0.5 }}>
            AI-powered viral clip generator
          </Typography>
        </Box>

        {/* Main Content */}
        <Container maxWidth="md" sx={{ pb: 6 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/processing/:jobId" element={<ProcessingPage />} />
            <Route path="/result/:jobId" element={<ResultPage />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
