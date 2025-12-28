import React, { useState, memo } from 'react';
import Box from '@mui/material/Box';
import { COLORS, SHADOWS } from '../../styles/styleConstants';
import Loading from './Loading';

/**
 * Optimized image component with lazy loading, placeholder, and error handling
 */
const OptimizedImage = ({
  src,
  alt,
  width = '100%',
  height = 'auto',
  aspectRatio,
  lazy = true,
  placeholder = null,
  fallback = null,
  onLoad,
  onError,
  borderRadius = 0,
  boxShadow = null,
  objectFit = 'cover',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = (event) => {
    setIsLoaded(true);
    if (onLoad) onLoad(event);
  };

  const handleError = (event) => {
    setHasError(true);
    if (onError) onError(event);
  };

  // Show fallback if there was an error loading the image
  if (hasError && fallback) {
    return typeof fallback === 'function' ? fallback() : fallback;
  }

  // Calculate aspect ratio styles if provided
  const aspectRatioStyles = aspectRatio ? {
    aspectRatio,
    objectFit,
  } : {};

  // The actual image, with or without lazy loading
  const imageElement = (
    <Box
      component="img"
      src={src}
      alt={alt || ''}
      loading={lazy ? 'lazy' : 'eager'}
      onLoad={handleLoad}
      onError={handleError}
      sx={{
        width,
        height,
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s',
        borderRadius,
        boxShadow: boxShadow || 'none',
        ...aspectRatioStyles,
        ...props.sx,
      }}
      {...props}
    />
  );

  // Show placeholder while loading
  if (!isLoaded) {
    return (
      <Box
        sx={{
          position: 'relative',
          width,
          height,
          ...aspectRatioStyles,
          backgroundColor: COLORS.BACKGROUND.LIGHT,
          borderRadius,
          boxShadow: boxShadow || 'none',
          overflow: 'hidden',
          ...props.sx,
        }}
      >
        {imageElement}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {placeholder || <Loading size="small" showText={false} />}
        </Box>
      </Box>
    );
  }

  return imageElement;
};

export default memo(OptimizedImage);