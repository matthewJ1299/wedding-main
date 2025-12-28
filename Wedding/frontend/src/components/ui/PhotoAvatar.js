import React from 'react';
import Box from '@mui/material/Box';

/**
 * A reusable avatar/photo component for displaying profile images
 * with consistent styling.
 */
const PhotoAvatar = ({
  src,
  alt,
  size = 'medium',
  style = {},
  ...props
}) => {
  // Define sizes for different variants
  const sizeStyles = {
    small: { width: { xs: 80, sm: 120 }, height: { xs: 80, sm: 120 } },
    medium: { width: { xs: 120, sm: 180 }, height: { xs: 120, sm: 180 } },
    large: { width: { xs: 160, sm: 240 }, height: { xs: 160, sm: 240 } }
  };

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{
        ...sizeStyles[size],
        objectFit: 'cover',
        borderRadius: '50%',
        boxShadow: 4,
        mb: 2,
        ...style
      }}
      {...props}
    />
  );
};

export default PhotoAvatar;