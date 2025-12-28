import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HeaderNavigation from '../components/homepage/HeaderNavigation';
import '../styles/HomePageModern.css';

/**
 * FAQ page component displaying common questions and answers
 */
export default function FAQPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const navbar = document.querySelector('.MuiAppBar-root');
    if (navbar) {
      navbar.style.display = 'none';
    }
    return () => {
      const restoredNavbar = document.querySelector('.MuiAppBar-root');
      if (restoredNavbar) {
        restoredNavbar.style.display = 'flex';
      }
    };
  }, []);

  // FAQ data with questions and answers
  const faqItems = [
    {
      question: "What is the dress code?",
      answer: "The dress code for our wedding is semi-formal/cocktail attire. We recommend suits or dress shirts with slacks for men, and cocktail dresses or dressy separates for women."
    },
    {
      question: "Can I bring a plus one?",
      answer: "Due to venue capacity limitations, we can only accommodate the guests named on your invitation. Please refer to your invitation for details about your specific guest count."
    },
    {
      question: "Are children welcome at the wedding?",
      answer: "While we love your little ones, our wedding is an adults-only celebration. We hope this gives all parents an opportunity to let loose and enjoy the evening!"
    },
    {
      question: "Where should I park?",
      answer: "Complimentary parking is available at the venue. There will be signs and attendants to direct you to the designated parking areas."
    },
    {
      question: "Will the ceremony and reception be indoors or outdoors?",
      answer: "The ceremony will take place outdoors (weather permitting), while the reception will be held indoors. We recommend bringing a light jacket or wrap for the evening."
    },
    {
      question: "Are there accommodations nearby?",
      answer: "Yes! We've reserved room blocks at Hotel Example (mention our names for a special rate) and Hotel Sample nearby. Please see the 'Accommodations' section on our website for more details."
    },
    {
      question: "Do you have a registry?",
      answer: "Yes, we have registries at Target, Amazon, and Crate & Barrel. Links are available on our Registry page. Your presence at our wedding is the greatest gift of all, but if you wish to honor us with a gift, we've registered at these stores."
    },
    {
      question: "What time should I arrive?",
      answer: "Please arrive 15-30 minutes before the ceremony start time to allow for parking and seating. The ceremony will begin promptly as scheduled."
    },
    {
      question: "Is the venue wheelchair accessible?",
      answer: "Yes, the venue is fully wheelchair accessible with ramps and elevators available."
    },
    {
      question: "Can I take photos during the ceremony?",
      answer: "We kindly ask that you enjoy our ceremony in the moment and refrain from taking photos. We have professional photographers who will capture everything, and we'll share the photos with you!"
    }
  ];

  return (
    <Box className="home-page-modern">
      <HeaderNavigation />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#fff',
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
            py: { xs: 4, sm: 5 }
          }}
        >
          <Typography
            variant="h3"
            sx={{
              mb: 4,
              fontFamily: 'Arial, sans-serif',
              fontWeight: 300,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontSize: { xs: '1.8rem', sm: '2.2rem' }
            }}
          >
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
                sx={{
                  fontFamily: 'Arial, sans-serif',
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 400,
                    color: '#222',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  sx={{
                    color: '#666',
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 300,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    lineHeight: 1.6
                  }}
                >
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