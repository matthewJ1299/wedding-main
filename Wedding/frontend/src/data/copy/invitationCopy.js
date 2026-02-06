/**
 * Invitation page copy and formatting
 */
import { WEDDING_DATE, WEDDING_VENUE, WEDDING_COUPLE } from '../../utils/constants';

const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

function getOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function getInvitationDetails() {
  const d = new Date(WEDDING_DATE);
  const dayName = DAYS[d.getDay()];
  const month = MONTHS[d.getMonth()];
  const dateNum = d.getDate();
  const year = d.getFullYear();
  const hours = d.getHours();
  const hour12 = hours % 12 || 12;
  const period = hours >= 12 ? 'PM' : 'AM';
  const timeOfDay = hours >= 12 ? 'AFTERNOON' : 'MORNING';

  return {
    date: dayName,
    dateDetail: `${month} ${getOrdinal(dateNum)} ${year}`.toUpperCase(),
    time: `AT ${hour12}${period} IN THE ${timeOfDay}`,
    venue: WEDDING_VENUE.name,
    venue2: WEDDING_VENUE.location.split(',')[1]?.trim() || 'Pretoria',
    groom: WEDDING_COUPLE.groom,
    bride: WEDDING_COUPLE.bride,
    familiesLine: 'Together with their families',
    inviteLine: 'invite you to their wedding ceremony',
    receptionLine: 'Reception to follow',
  };
}
