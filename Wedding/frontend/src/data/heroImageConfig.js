/**
 * Hero section image configuration
 *
 * FOCAL POINT (objectPosition): Controls which part of the image is visible when cropped.
 * - Keywords: 'center center' | 'top left' | 'top center' | 'top right' |
 *             'center left' | 'center right' | 'bottom left' | 'bottom center' | 'bottom right'
 * - Percentages: '50% 30%' = 50% from left, 30% from top. Use to fine-tune (e.g. '40% 20%' focuses upper-left)
 * - Examples: 'center top' = focus top of image, '50% 75%' = focus lower third
 */
const basePath = process.env.PUBLIC_URL || '';

export const heroImages = {
  left: {
    src: `${basePath}/images/IMG-25.jpg`,
    objectPosition: 'center center',
  },
  center: {
    src: `${basePath}/images/IMG-139.jpg`,
    objectPosition: 'center center',
  },
  right: {
    src: `${basePath}/images/IMG-73.jpg`,
    objectPosition: 'center center',
  },
};
