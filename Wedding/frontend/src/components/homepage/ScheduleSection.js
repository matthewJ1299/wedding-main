import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { SCHEDULE_COPY } from '../../data/copy';
import sneakPeekImage from '../../assets/images/IMG-117.jpg';

const ICON_MAP = { favorite: FavoriteIcon, localBar: LocalBarIcon, restaurant: RestaurantIcon, celebration: CelebrationIcon };

export default function ScheduleSection() {
  const scheduleItems = SCHEDULE_COPY.items.map((item) => ({
    ...item,
    icon: ICON_MAP[item.iconKey] ?? FavoriteIcon,
  }));

  return (
    <Box id="schedule" className="schedule-section">
      <Typography className="section-title schedule-title">
        {SCHEDULE_COPY.sectionTitle}
      </Typography>
      <Box className="schedule-content">
        <Box className="schedule-image-wrapper">
          <img
            src={sneakPeekImage}
            alt="Matt and Sydney"
            className="schedule-image"
          />
        </Box>
        <Box className="schedule-items">
          {scheduleItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Box key={index} className="schedule-item">
                <IconComponent
                  sx={{
                    fontSize: 32,
                    color: 'var(--accent-color, #2d5c3a)',
                    mb: 1,
                  }}
                />
                <Typography className="schedule-time">{item.time}</Typography>
                <Typography className="schedule-event">{item.event}</Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
      <Typography className="schedule-subtitle">
        {SCHEDULE_COPY.subtitle}
      </Typography>
    </Box>
  );
}

