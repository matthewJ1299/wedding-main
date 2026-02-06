import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getFaqItems } from '../../data/copy';
import { RSVP_CONFIG } from '../../utils/constants';
import '../../styles/HomePageModern.css';

function formatRsvpDeadline(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function FAQSection() {
  const faqItems = getFaqItems(formatRsvpDeadline(RSVP_CONFIG.DEADLINE));

  return (
    <Box id="faq" className="faq-section">
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          m: 0,
          p: 3,
          pb: 8
        }}
      >
        <Box
          sx={{
            color: '#222',
            textAlign: 'center',
            width: { xs: '95%', sm: '80%', md: '70%' },
            maxWidth: '900px',
            py: { xs: 3, sm: 4 }
          }}
        >
          <Typography className="section-title">
            FREQUENTLY ASKED QUESTIONS
          </Typography>

          {faqItems.map((faq, index) => (
            <Accordion
              key={index}
              sx={{
                mb: 2,
                backgroundColor: '#fff',
                borderRadius: '0',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: 'none',
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography className="subsection-title" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography className="body-text">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

