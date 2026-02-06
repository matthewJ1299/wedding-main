/**
 * Travel & Stay section copy
 */
import hotel1Image from '../../assets/images/hotel1.jpeg';
import villaImage from '../../assets/images/villa.jpeg';

export const TRAVEL_STAY_COPY = {
  sectionTitle: 'TRAVEL & STAY',
  intro: "We've chosen two nearby spots we love for your stay - both close, comfortable, and convenient.",
  accommodations: [
    {
      name: 'Morgenzon',
      link: 'https://www.morgenzon.co.za/',
      distance: 'Approximately 17 minutes by car',
      address: '274 Airport Rd, Cynthia Vale AH, Pretoria',
      image: hotel1Image,
    },
    {
      name: 'Villa San Giovanni',
      link: 'https://vsg.co.za/',
      distance: 'Approximately 18 minutes by car',
      address: 'Wonderboom National Airport, Main Terminal Building, Linvelt Rd, Doornpoort, Pretoria',
      image: villaImage,
    },
  ],
  paymentReference: 'Please use "Jordaan Wedding 03 Oct 26" as a reference when paying the accommodation.',
  shuttleInfo: "To make getting around stress-free, we'll be providing a complimentary shuttle service between the accommodation and the venue. No pre-booking required.",
  shuttleTimes: 'We will share shuttle running times closer to the date.',
  closing: "If you have any questions or need help planning your stay, please don't hesitate to reach out, we can't wait to celebrate with you!",
};
