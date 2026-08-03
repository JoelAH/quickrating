"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Typography,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import { toast } from 'react-toastify';
import styles from './imageGeneratorModal.module.scss';

type Platform = 'facebook' | 'instagram' | 'x';

interface ImageGeneratorModalProps {
  open: boolean;
  onClose: () => void;
  reviewId: string;
}

interface ModalState {
  platform: Platform;
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
  transitioning: boolean;
}

export function ImageGeneratorModal({ open, onClose, reviewId }: ImageGeneratorModalProps): JSX.Element {
  const [state, setState] = useState<ModalState>({
    platform: 'instagram',
    imageUrl: null,
    loading: false,
    error: null,
    transitioning: false,
  });

  const handlePlatformChange = (_event: React.MouseEvent<HTMLElement>, newPlatform: Platform | null) => {
    if (newPlatform !== null && newPlatform !== state.platform) {
      // Start transition animation
      setState(prev => ({ ...prev, transitioning: true }));
      
      // Wait for fade-out animation to complete before changing platform
      setTimeout(() => {
        setState(prev => ({ ...prev, platform: newPlatform, transitioning: false }));
      }, 300);
    }
  };

  const fetchImage = async (platform: Platform) => {
    // Set loading state before fetch
    setState(prev => ({ ...prev, loading: true, error: null, imageUrl: null, transitioning: false }));

    try {
      // Build URL with reviewId and platform query parameters
      const url = `/api/review-image?reviewId=${encodeURIComponent(reviewId)}&platform=${encodeURIComponent(platform)}`;
      
      // Create abort controller for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // Fetch image from API route
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorMessage = response.status === 401 
          ? 'You must be logged in to generate images'
          : response.status === 403
          ? 'You do not have permission to access this review'
          : response.status === 404
          ? 'Review not found'
          : 'Failed to generate image';
        throw new Error(errorMessage);
      }

      // Convert response to blob
      const blob = await response.blob();
      
      // Convert blob to blob URL
      const blobUrl = URL.createObjectURL(blob);

      // Update imageUrl state with blob URL
      setState(prev => ({ ...prev, imageUrl: blobUrl, loading: false, transitioning: false }));
    } catch (error) {
      console.error('Error fetching image:', error);
      
      let errorMessage = 'Failed to generate image';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Image generation is taking longer than expected. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        transitioning: false,
      }));
    }
  };

  // Trigger fetch on mount and when platform changes
  useEffect(() => {
    if (open) {
      fetchImage(state.platform);
    }
  }, [open, state.platform]);

  // Cleanup blob URL when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (state.imageUrl) {
        URL.revokeObjectURL(state.imageUrl);
      }
    };
  }, [state.imageUrl]);

  const handleDownload = async () => {
    if (!state.imageUrl) return;

    try {
      // Fetch image blob from the API
      const url = `/api/review-image?reviewId=${encodeURIComponent(reviewId)}&platform=${encodeURIComponent(state.platform)}`;
      
      // Create abort controller for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to download image');
      }

      const blob = await response.blob();
      
      // Generate filename with platform and timestamp
      const timestamp = Date.now();
      const filename = `review-${state.platform}-${reviewId}-${timestamp}.png`;

      // Create download link using anchor element with download attribute
      const downloadUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = filename;
      
      // Trigger download
      document.body.appendChild(anchor);
      anchor.click();
      
      // Cleanup
      document.body.removeChild(anchor);
      URL.revokeObjectURL(downloadUrl);
      
      // Show success notification
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Error downloading image:', error);
      
      // Show error notification using react-toastify
      if (error instanceof Error && error.name === 'AbortError') {
        toast.error('Download timed out. Please try again.');
      } else {
        toast.error('Failed to download image. Please try again.');
      }
    }
  };

  const handleRetry = () => {
    fetchImage(state.platform);
  };

  const handleClose = () => {
    // Clean up blob URL when closing modal
    if (state.imageUrl) {
      URL.revokeObjectURL(state.imageUrl);
      setState(prev => ({ ...prev, imageUrl: null, transitioning: false }));
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <ToggleButtonGroup
            value={state.platform}
            exclusive
            onChange={handlePlatformChange}
            aria-label="social media platform"
            fullWidth
            sx={{
              '& .MuiToggleButton-root': {
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
              },
              '& .MuiToggleButton-root.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            }}
          >
            <ToggleButton value="facebook" aria-label="facebook">
              <FacebookIcon sx={{ mr: 1 }} />
              Facebook
            </ToggleButton>
            <ToggleButton value="instagram" aria-label="instagram">
              <InstagramIcon sx={{ mr: 1 }} />
              Instagram
            </ToggleButton>
            <ToggleButton value="x" aria-label="x">
              <XIcon sx={{ mr: 1 }} />
              X
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Image preview area */}
        <Box className={styles.previewContainer}>
          {state.loading && (
            <Box className={styles.loadingState}>
              <CircularProgress size={48} className={styles.spinner} />
              <Typography variant="body2" className={styles.loadingText}>
                Generating image...
              </Typography>
            </Box>
          )}

          {!state.loading && state.error && (
            <Box className={styles.errorState}>
              <Typography variant="body1" className={styles.errorMessage}>
                {state.error}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRetry}
                className={styles.retryButton}
              >
                Retry
              </Button>
            </Box>
          )}

          {!state.loading && !state.error && state.imageUrl && (
            <Box
              component="img"
              src={state.imageUrl}
              alt={`Review image for ${state.platform}`}
              className={`${styles.imagePreview} ${state.transitioning ? styles.transitioning : ''}`}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Close
        </Button>
        <Button 
          onClick={handleDownload}
          variant="contained"
          startIcon={<DownloadIcon />}
          disabled={state.loading || !!state.error || !state.imageUrl}
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
}
