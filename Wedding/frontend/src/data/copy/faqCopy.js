/**
 * FAQ section copy
 * RSVP deadline is interpolated from RSVP_CONFIG.DEADLINE
 */
export const getFaqItems = (rsvpDeadlineFormatted) => [
  {
    question: 'What is the RSVP deadline?',
    answer: `We kindly ask that you RSVP by no later than ${rsvpDeadlineFormatted}, for us to finalise the head count. We don't want anyone going hungry.`,
  },
  {
    question: 'What is the dress code?',
    answer: 'Semi-formal attire. Ladies, we ask that you please avoid green dresses.',
  },
  {
    question: 'Can I bring a plus one?',
    answer: "We're keeping the wedding small, so unfortunately no plus ones unless stated on your wedding invitation.",
  },
  {
    question: 'Are children welcome at the wedding?',
    answer: "While we love your little ones, we kindly ask that this be an adults-only celebration. Thank you for understanding.",
  },
  {
    question: 'Where should I park?',
    answer: "There's plenty of safe parking at the venue. We recommend Uber/Rydd or our shuttle so you can enjoy the party without worrying about getting home.",
  },
  {
    question: 'Will the ceremony and reception be indoors or outdoors?',
    answer: "The ceremony will take place undercover, so we're covered rain or shine! After the vows, the canapés will be served outdoors, shaded areas will be available to keep you comfortable. The reception will be indoors, but evenings can get a little chilly, so we recommend bringing a light jersey or wrap just in case.",
  },
  {
    question: 'Are there accommodations nearby?',
    answer: 'Please see our accommodation section for a list of our preferred accommodations nearby.',
  },
  {
    question: 'What time should I arrive?',
    answer: "The ceremony will begin at 15:30, so we recommend arriving at 15:00 to get settled, soak in the atmosphere and enjoy the start of the celebrations.",
  },
  {
    question: 'Can I take photos during the ceremony?',
    answer: "We're going unplugged for the ceremony so everyone can be fully present and enjoy the moment, no phones or cameras needed! Our professional photographers will be capturing all the magic, and we can't wait to share the beautiful photos with you afterward.",
  },
  {
    question: 'Will there be a cash bar?',
    answer: "As much as we'd love to keep everyone's drinks flowing all night, knowing how much some of you can put away would bankrupt us😉. We'll have a limited tab during canapés(beer, cider and wine), and after that the bar will be cash.",
  }
];
