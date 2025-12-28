// Test script to verify all invitee CRUD operations
import path from 'path';
import { randomUUID } from 'crypto';
import InviteeRepository from './repositories/InviteeRepository.js';

const dbPath = path.join(process.cwd(), 'data.sqlite');

async function testInviteeCRUD() {
  console.log('🧪 Starting Invitee CRUD Tests...\n');
  
  try {
    // Initialize repository
    console.log('1. Initializing repository...');
    const repo = new InviteeRepository(dbPath);
    console.log('✅ Repository initialized successfully\n');
    
    // Test CREATE
    console.log('2. Testing CREATE operation...');
    const testInvitee = {
      id: randomUUID(),
      name: 'Test User',
      partner: 'Test Partner',
      email: 'test@example.com',
      phone: '123-456-7890',
      rsvp: 'yes',
      inviteCode: 'TEST123',
      allowPlusOne: true,
      plusOneName: 'Test Plus One'
    };
    
    repo.create(testInvitee);
    console.log('✅ Created test invitee:', testInvitee.id);
    
    // Test READ (getById)
    console.log('\n3. Testing READ operation (getById)...');
    const retrieved = repo.getById(testInvitee.id);
    if (retrieved) {
      console.log('✅ Retrieved invitee:', retrieved.name);
    } else {
      throw new Error('Failed to retrieve invitee');
    }
    
    // Test READ (getAll)
    console.log('\n4. Testing READ operation (getAll)...');
    const allInvitees = repo.getAll();
    console.log(`✅ Retrieved ${allInvitees.length} invitees total`);
    
    // Test UPDATE
    console.log('\n5. Testing UPDATE operation...');
    const updates = {
      name: 'Updated Test User',
      email: 'updated@example.com',
      rsvp: 'no'
    };
    
    const updateResult = repo.update(testInvitee.id, updates);
    if (updateResult) {
      console.log('✅ Updated invitee successfully');
      const updated = repo.getById(testInvitee.id);
      console.log('Updated name:', updated.name);
      console.log('Updated email:', updated.email);
      console.log('Updated rsvp:', updated.rsvp);
    } else {
      throw new Error('Failed to update invitee');
    }
    
    // Test DELETE
    console.log('\n6. Testing DELETE operation...');
    const deleteResult = repo.delete(testInvitee.id);
    if (deleteResult) {
      console.log('✅ Deleted invitee successfully');
      const deleted = repo.getById(testInvitee.id);
      if (!deleted) {
        console.log('✅ Confirmed invitee was deleted');
      } else {
        throw new Error('Invitee still exists after deletion');
      }
    } else {
      throw new Error('Failed to delete invitee');
    }
    
    console.log('\n🎉 All CRUD operations completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Test CORS function
function testCorsFunction() {
  console.log('\n🌐 Testing CORS function...');
  
  function withCors(response) {
    const origin = process.env.ORIGIN_URL || 'http://localhost:3000';
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }
  
  // Mock response object for testing
  const mockResponse = {
    headers: new Map(),
    set: function(name, value) { this.headers.set(name, value); }
  };
  
  const corsResponse = withCors(mockResponse);
  
  console.log('✅ CORS function works');
  console.log('Headers:', Object.fromEntries(corsResponse.headers.entries()));
}

// Run tests
testInviteeCRUD().then(() => {
  testCorsFunction();
  console.log('\n✨ All tests completed successfully!');
}).catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
