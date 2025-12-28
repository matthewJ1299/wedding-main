// Test script to verify API endpoints
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function testEndpoint(method, endpoint, data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    console.log(`Testing ${method} ${endpoint}...`);
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    
    console.log(`Status: ${response.status}`);
    console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
    
    if (response.status >= 200 && response.status < 300) {
      const result = await response.text();
      try {
        const json = JSON.parse(result);
        console.log('Response:', json);
      } catch {
        console.log('Response (text):', result);
      }
      console.log('✅ Success\n');
      return true;
    } else {
      const error = await response.text();
      console.log('❌ Error:', error);
      console.log('');
      return false;
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    console.log('');
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing API Endpoints...\n');
  
  // Test OPTIONS (preflight)
  await testEndpoint('OPTIONS', '/api/invitees');
  await testEndpoint('OPTIONS', '/api/invitees/test-id');
  
  // Test GET
  await testEndpoint('GET', '/api/invitees');
  
  // Test POST
  const testInvitee = {
    name: 'API Test User',
    email: 'apitest@example.com',
    phone: '555-123-4567',
    rsvp: 'yes'
  };
  
  const postResult = await testEndpoint('POST', '/api/invitees', testInvitee);
  
  if (postResult) {
    // Test PUT (we'll need to get an actual ID from the GET response)
    console.log('Testing PUT with a real ID...');
    const getResponse = await fetch(`${BASE_URL}/api/invitees`);
    if (getResponse.ok) {
      const invitees = await getResponse.json();
      if (invitees.length > 0) {
        const testId = invitees[0].id;
        const updateData = { name: 'Updated via API Test', rsvp: 'no' };
        await testEndpoint('PUT', `/api/invitees/${testId}`, updateData);
      }
    }
  }
  
  console.log('🏁 Endpoint tests completed!');
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/invitees`);
    if (response.ok) {
      console.log('✅ Server is running on', BASE_URL);
      return true;
    }
  } catch (error) {
    console.log('❌ Server is not running on', BASE_URL);
    console.log('Please start the Next.js server with: npm run dev');
    return false;
  }
}

checkServer().then(serverRunning => {
  if (serverRunning) {
    runTests();
  }
});
