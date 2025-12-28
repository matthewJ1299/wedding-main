import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const SCHEDULE_ITEMS = [
  { time: '4:00 PM', event: 'CEREMONY' },
  { time: '5:00 PM', event: 'COCKTAIL' },
  { time: '6:30 PM', event: 'DINNER' },
  { time: '10:00 PM', event: 'DANCING & FIREWORKS' },
];

export default function ScheduleSection() {
  return (
    <Box className="modern-schedule-section">
      <Typography className="modern-section-title modern-schedule-title">
        HERE'S A SNEAK PEEK OF OUR SPECIAL DAY'S SCHEDULE
      </Typography>
      <Box className="modern-schedule-items">
        {SCHEDULE_ITEMS.map((item, index) => (
          <Box key={index} className="modern-schedule-item">
            <Typography className="modern-schedule-time">{item.time}</Typography>
            <Typography className="modern-schedule-event">{item.event}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

