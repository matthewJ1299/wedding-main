/**
 * Our Story timeline image configuration
 *
 * FOCAL POINT (objectPosition): Controls which part of the image is visible when cropped.
 * - Keywords: 'center center' | 'top left' | 'top center' | 'top right' |
 *             'center left' | 'center right' | 'bottom left' | 'bottom center' | 'bottom right'
 * - Percentages: '50% 30%' = 50% from left, 30% from top (e.g. '40% 20%' focuses upper-left)
 */
import firstoutingImage from '../assets/images/firstouting.jpeg';
import houseImage from '../assets/images/house.jpeg';
import lionsImage from '../assets/images/lions.jpeg';
import engagedImage from '../assets/images/engaged.jpeg';

export const ourStoryImages = {
  howWeMet: {
    image: firstoutingImage,
    objectPosition: 'center center',
  },
  movedIn: {
    image: houseImage,
    objectPosition: 'center center',
  },
  lifeTogether: {
    image: lionsImage,
    objectPosition: 'center center',
  },
  theProposal: {
    image: engagedImage,
    objectPosition: 'center center',
  },
  ourEngagement: {
    image: engagedImage,
    objectPosition: 'center center',
  },
};
