import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Typography, Tab, Tabs,
  IconButton, CircularProgress, Alert, Fade,
} from '@mui/material';
import {
  CloudUpload, YouTube, ContentCut, AutoAwesome,
} from '@mui/icons-material';
import { submitUrl, submitFile } from '../services/api';

export default function HomePage() {
  const [tab, setTab] = useState(0);
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      let result;
      if (tab === 0) {
        if (!url.trim()) { setError('Please enter a YouTube URL'); setLoading(false); return; }
        result = await submitUrl(url.trim());
      } else {
        if (!file) { setError('Please select a video file'); setLoading(false); return; }
        result = await submitFile(file);
      }
      navigate(`/processing/${result.jobId}`);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <Fade in timeout={600}>
      <Box>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box sx={{
            display: 'inline-flex', p: 2, borderRadius: '50%', mb: 3,
            background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(6,182,212,0.2) 100%)',
            border: '1px solid rgba(124,58,237,0.3)',
          }}>
            <ContentCut sx={{ fontSize: 48, color: 'primary.light' }} />
          </Box>
          <Typography variant="h3" sx={{
            fontWeight: 800, mb: 2,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #A78BFA 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Turn Videos into<br />Viral Clips
          </Typography>
          <Typography variant="h6" sx={{ color: 'grey.400', fontWeight: 400, maxWidth: 500, mx: 'auto' }}>
            Paste a YouTube URL or upload a video. AI extracts the best moments and creates vertical clips with viral subtitles.
          </Typography>
        </Box>

        {/* Feature Pills */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 5, flexWrap: 'wrap' }}>
          {[
            { icon: '🎙️', text: 'AI Transcription' },
            { icon: '🧠', text: 'Smart Analysis' },
            { icon: '📐', text: '9:16 Vertical' },
            { icon: '💬', text: 'Viral Subtitles' },
          ].map((f) => (
            <Box key={f.text} sx={{
              px: 2, py: 1, borderRadius: 8,
              background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
              display: 'flex', alignItems: 'center', gap: 1,
            }}>
              <span>{f.icon}</span>
              <Typography variant="body2" sx={{ color: 'grey.300' }}>{f.text}</Typography>
            </Box>
          ))}
        </Box>

        {/* Input Card */}
        <Paper sx={{
          p: 4, borderRadius: 4, maxWidth: 600, mx: 'auto',
          background: 'linear-gradient(145deg, #13131A 0%, #1A1A25 100%)',
          border: '1px solid rgba(124,58,237,0.2)',
        }}>
          <Tabs
            value={tab}
            onChange={(_, v) => { setTab(v); setError(''); }}
            sx={{ mb: 3 }}
            variant="fullWidth"
            TabIndicatorProps={{ sx: { background: 'linear-gradient(90deg, #7C3AED, #06B6D4)', height: 3, borderRadius: 2 } }}
          >
            <Tab icon={<YouTube />} label="YouTube URL" sx={{ textTransform: 'none', fontWeight: 600 }} />
            <Tab icon={<CloudUpload />} label="Upload Video" sx={{ textTransform: 'none', fontWeight: 600 }} />
          </Tabs>

          {tab === 0 ? (
            <TextField
              fullWidth
              placeholder="https://youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                },
              }}
            />
          ) : (
            <Box
              onClick={() => fileRef.current?.click()}
              sx={{
                border: '2px dashed',
                borderColor: file ? 'primary.main' : 'rgba(124,58,237,0.3)',
                borderRadius: 3, p: 4, textAlign: 'center', cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: file ? 'rgba(124,58,237,0.05)' : 'transparent',
                '&:hover': { borderColor: 'primary.light', backgroundColor: 'rgba(124,58,237,0.08)' },
              }}
            >
              <CloudUpload sx={{ fontSize: 40, color: file ? 'primary.main' : 'grey.500', mb: 1 }} />
              <Typography variant="body1" sx={{ color: file ? 'primary.light' : 'grey.400' }}>
                {file ? file.name : 'Click to upload a video file'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'grey.600' }}>
                MP4, WebM, MOV — up to 500 MB
              </Typography>
              <input ref={fileRef} type="file" hidden accept="video/*" onChange={(e) => setFile(e.target.files[0])} />
            </Box>
          )}

          {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
            sx={{ mt: 3, py: 1.8, fontSize: '1.1rem' }}
          >
            {loading ? 'Processing...' : 'Generate Viral Clips'}
          </Button>
        </Paper>
      </Box>
    </Fade>
  );
}
