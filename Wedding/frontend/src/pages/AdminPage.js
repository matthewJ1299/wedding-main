import React, { useState, useEffect } from 'react';
import { useInvitees } from '../contexts/InviteeContext';

// Material UI components
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// Custom components
import HeaderNavigation from '../components/homepage/HeaderNavigation';

// Admin components
import InviteeTable from '../components/admin/InviteeTable';
// import SummaryTab from '../components/admin/SummaryTab';
import EnhancedSummaryTab from '../components/admin/EnhancedSummaryTab';
import AddInviteeForm from '../components/admin/AddInviteeForm';
import PhotoManagementTab from '../components/admin/PhotoManagementTab';
import BulkActionsToolbar from '../components/admin/BulkActionsToolbar';
import { EmailTemplateProvider } from '../contexts/EmailTemplateContext';
import EmailTab from '../components/email/EmailTab';

// Styles
import '../styles/HomePageModern.css';

/**
 * Admin page component with invitee management and email capabilities
 */
const AdminPage = () => {
  const [tab, setTab] = useState(0);
  const [selectedInvitees, setSelectedInvitees] = useState([]);
  const { invitees, addInvitee, updateInvitee, removeInvitee } = useInvitees();

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/15535018-63ec-4533-ac3a-1343c253b7ec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AdminPage.js:35',message:'AdminPage mounted - checking NavBar visibility',data:{hasNavBar:!!document.querySelector('.MuiAppBar-root')},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
  }, []);
  // #endregion

  useEffect(() => {
    // Hide the default navbar for this page
    const navbar = document.querySelector('.MuiAppBar-root');
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/15535018-63ec-4533-ac3a-1343c253b7ec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AdminPage.js:42',message:'NavBar visibility check before hide',data:{navbarFound:!!navbar,navbarDisplay:navbar?.style?.display},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    if (navbar) {
      navbar.style.display = 'none';
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/15535018-63ec-4533-ac3a-1343c253b7ec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AdminPage.js:46',message:'NavBar hidden',data:{navbarDisplayAfter:navbar.style.display},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
    }
    return () => {
      // Restore navbar when leaving page
      const restoredNavbar = document.querySelector('.MuiAppBar-root');
      if (restoredNavbar) {
        restoredNavbar.style.display = 'flex';
      }
    };
  }, []);

  // #region agent log
  useEffect(() => {
    const bodyStyles = window.getComputedStyle(document.body);
    const pageClass = document.querySelector('.home-page-modern');
    fetch('http://127.0.0.1:7242/ingest/15535018-63ec-4533-ac3a-1343c253b7ec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AdminPage.js:60',message:'Styling verification',data:{hasHomePageModernClass:!!pageClass,bodyBackground:bodyStyles.backgroundColor,bodyFontFamily:bodyStyles.fontFamily},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'C'})}).catch(()=>{});
  }, []);
  // #endregion

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
            width: '100%',
            maxWidth: '1400px',
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Tabs 
            value={tab} 
            onChange={(_, v) => setTab(v)}
            sx={{
              mb: 4,
              '& .MuiTab-root': {
                fontFamily: 'Arial, sans-serif',
                fontSize: '0.9rem',
                fontWeight: 400,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#222',
                minWidth: '120px'
              },
              '& .Mui-selected': {
                color: '#222 !important'
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#222'
              }
            }}
          >
            <Tab label="Invitees" />
            <Tab label="Add Invitee" />
            <Tab label="Email" />
            <Tab label="Photos" />
            <Tab label="Summary" />
          </Tabs>

          {tab === 0 && (
            <>
              <BulkActionsToolbar
                selectedInvitees={selectedInvitees}
                onBulkUpdate={updateInvitee}
                onBulkDelete={removeInvitee}
                onClearSelection={() => setSelectedInvitees([])}
              />
              <InviteeTable 
                invitees={invitees} 
                updateInvitee={updateInvitee} 
                removeInvitee={removeInvitee}
                selectedInvitees={selectedInvitees}
                onSelectionChange={setSelectedInvitees}
              />
            </>
          )}
          {tab === 1 && <AddInviteeForm addInvitee={addInvitee} />}
          {tab === 2 && (
            <EmailTemplateProvider>
              <EmailTab />
            </EmailTemplateProvider>
          )}
          {tab === 3 && <PhotoManagementTab />}
          {tab === 4 && <EnhancedSummaryTab invitees={invitees} />}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPage;