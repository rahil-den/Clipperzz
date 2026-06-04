import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, LinearProgress, Chip, Fade, Stepper, Step, StepLabel,
} from '@mui/material';
import {
  Download, Mic, Psychology, ContentCut, Subtitles, Movie, CloudDownload, VideoFile,
} from '@mui/icons-material';
import { getJobStatus } from '../services/api';

const PIPELINE_STAGES = [
  { label: 'Downloading', icon: <CloudDownload />, progressRange: [0, 15] },
  { label: 'Normalizing', icon: <VideoFile />, progressRange: [15, 25] },
  { label: 'Transcribing', icon: <Mic />, progressRange: [25, 50] },
  { label: 'Analyzing', icon: <Psychology />, progressRange: [50, 65] },
  { label: 'Clipping', icon: <ContentCut />, progressRange: [65, 85] },
  { label: 'Subtitles', icon: <Subtitles />, progressRange: [85, 95] },
  { label: 'Rendering', icon: <Movie />, progressRange: [95, 100] },
];

function getActiveStep(progress) {
  for (let i = 0; i < PIPELINE_STAGES.length; i++) {
    const [, end] = PIPELINE_STAGES[i].progressRange;
    if (progress < end) return i;
  }
  return PIPELINE_STAGES.length;
}

export default function ProcessingPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    let interval;
    const poll = async () => {
      try {
        const data = await getJobStatus(jobId);
        setStatus(data.status);
        setProgress(data.progress || 0);

        if (data.status === 'completed') {
          clearInterval(interval);
          setTimeout(() => navigate(`/result/${jobId}`), 1000);
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setError(data.failedReason || 'Processing failed');
        }
      } catch (err) {
        setError('Failed to fetch status');
      }
    };

    poll();
    interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [jobId, navigate]);

  const activeStep = getActiveStep(progress);

  return (
    <Fade in timeout={600}>
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Paper sx={{
          p: 5, borderRadius: 4, textAlign: 'center',
          background: 'linear-gradient(145deg, #13131A 0%, #1A1A25 100%)',
          border: '1px solid rgba(124,58,237,0.2)',
        }}>
          {/* Animated Spinner */}
          <Box sx={{
            width: 100, height: 100, mx: 'auto', mb: 3, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: status === 'completed' ? 'none' : 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { boxShadow: '0 0 0 0 rgba(124,58,237,0.4)' },
              '70%': { boxShadow: '0 0 0 20px rgba(124,58,237,0)' },
              '100%': { boxShadow: '0 0 0 0 rgba(124,58,237,0)' },
            },
          }}>
            {status === 'completed' ? (
              <Typography sx={{ fontSize: 48 }}>✅</Typography>
            ) : error ? (
              <Typography sx={{ fontSize: 48 }}>❌</Typography>
            ) : (
              <Typography sx={{ fontSize: 48, animation: 'spin 3s linear infinite', '@keyframes spin': { '100%': { transform: 'rotate(360deg)' } } }}>⚙️</Typography>
            )}
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            {status === 'completed' ? 'Processing Complete!' : error ? 'Processing Failed' : 'Creating Your Clips...'}
          </Typography>

          <Typography variant="body2" sx={{ color: 'grey.500', mb: 3 }}>
            Job: {jobId?.substring(0, 8)}...
          </Typography>

          {error ? (
            <Chip label={error} color="error" variant="outlined" sx={{ mb: 3 }} />
          ) : (
            <>
              {/* Progress Bar */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    {activeStep < PIPELINE_STAGES.length ? PIPELINE_STAGES[activeStep].label : 'Done'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'primary.light', fontWeight: 600 }}>
                    {progress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>

              {/* Pipeline Steps */}
              <Stepper activeStep={activeStep} alternativeLabel sx={{
                '& .MuiStepLabel-label': { fontSize: '0.7rem', color: 'grey.500', mt: 0.5 },
                '& .MuiStepLabel-label.Mui-active': { color: 'primary.light' },
                '& .MuiStepLabel-label.Mui-completed': { color: 'success.main' },
                '& .MuiStepIcon-root': { color: 'rgba(124,58,237,0.2)' },
                '& .MuiStepIcon-root.Mui-active': { color: 'primary.main' },
                '& .MuiStepIcon-root.Mui-completed': { color: 'success.main' },
              }}>
                {PIPELINE_STAGES.map((stage) => (
                  <Step key={stage.label}>
                    <StepLabel>{stage.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </>
          )}
        </Paper>
      </Box>
    </Fade>
  );
}
