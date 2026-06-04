import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, Button, Grid, Chip, Fade, Skeleton, IconButton,
} from '@mui/material';
import {
  Download, ArrowBack, PlayCircle, AccessTime, TrendingUp, Label,
} from '@mui/icons-material';
import { getJobStatus, getDownloadUrl } from '../services/api';

export default function ResultPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getJobStatus(jobId);
        setJob(data);
      } catch (err) {
        console.error('Failed to fetch results:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [jobId]);

  const clips = job?.result?.clips || [];

  if (loading) {
    return (
      <Box sx={{ maxWidth: 700, mx: 'auto' }}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rounded" height={200} sx={{ mb: 3, borderRadius: 4 }} />
        ))}
      </Box>
    );
  }

  return (
    <Fade in timeout={600}>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/')} sx={{ color: 'grey.400' }}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Your Clips Are Ready! 🎉
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.500' }}>
                {clips.length} viral clip{clips.length !== 1 ? 's' : ''} generated
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{ borderColor: 'rgba(124,58,237,0.3)', color: 'primary.light' }}
          >
            New Video
          </Button>
        </Box>

        {/* Clips Grid */}
        <Grid container spacing={3}>
          {clips.map((clip) => (
            <Grid item xs={12} key={clip.clipIndex}>
              <Paper sx={{
                borderRadius: 4, overflow: 'hidden',
                background: 'linear-gradient(145deg, #13131A 0%, #1A1A25 100%)',
                border: '1px solid rgba(124,58,237,0.2)',
                transition: 'all 0.3s',
                '&:hover': {
                  border: '1px solid rgba(124,58,237,0.4)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px rgba(124,58,237,0.15)',
                },
              }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                  {/* Video Preview */}
                  <Box sx={{
                    width: { xs: '100%', sm: 200 }, minHeight: 200,
                    position: 'relative', flexShrink: 0,
                    backgroundColor: '#000',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <video
                      src={getDownloadUrl(clip.finalFilename)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      controls
                      preload="metadata"
                    />
                  </Box>

                  {/* Clip Info */}
                  <Box sx={{ p: 3, flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Clip {clip.clipIndex}
                      </Typography>
                      <Chip
                        label={clip.type}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(124,58,237,0.15)',
                          color: 'primary.light',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                        }}
                      />
                    </Box>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', gap: 3, mb: 2.5, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime sx={{ fontSize: 18, color: 'grey.500' }} />
                        <Typography variant="body2" sx={{ color: 'grey.400' }}>
                          {clip.duration?.toFixed(1)}s
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TrendingUp sx={{ fontSize: 18, color: clip.score > 0.7 ? 'success.main' : 'warning.main' }} />
                        <Typography variant="body2" sx={{ color: 'grey.400' }}>
                          Score: {(clip.score * 100).toFixed(0)}%
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime sx={{ fontSize: 18, color: 'grey.500' }} />
                        <Typography variant="body2" sx={{ color: 'grey.500' }}>
                          {clip.start?.toFixed(1)}s – {clip.end?.toFixed(1)}s
                        </Typography>
                      </Box>
                    </Box>

                    {/* Download Button */}
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      href={getDownloadUrl(clip.finalFilename)}
                      download
                      sx={{ borderRadius: 3 }}
                    >
                      Download Clip
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {clips.length === 0 && (
          <Paper sx={{
            p: 5, textAlign: 'center', borderRadius: 4,
            background: 'linear-gradient(145deg, #13131A 0%, #1A1A25 100%)',
          }}>
            <Typography variant="h6" sx={{ color: 'grey.500' }}>
              No clips were generated. The video may be too short or the processing may have failed.
            </Typography>
            <Button variant="outlined" onClick={() => navigate('/')} sx={{ mt: 2 }}>
              Try Another Video
            </Button>
          </Paper>
        )}
      </Box>
    </Fade>
  );
}
