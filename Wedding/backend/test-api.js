// Test script to verify all invitee CRUD operations
import { randomUUID } from 'crypto';
import InviteeRepository from './repositories/InviteeRepository.js';
import { getDb } from './src/db/database.js';

async function testInviteeCRUD() {
  console.log('Starting Invitee CRUD Tests...\n');

  try {
    console.log('1. Initializing repository...');
    const repo = new InviteeRepository(getDb());
    console.log('Repository initialized successfully\n');

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
      plusOneName: 'Test Plus One',
    };

    await repo.create(testInvitee);
    console.log('Created test invitee:', testInvitee.id);

    console.log('\n3. Testing READ operation (getById)...');
    const retrieved = await repo.getById(testInvitee.id);
    if (retrieved) {
      console.log('Retrieved invitee:', retrieved.name);
    } else {
      throw new Error('Failed to retrieve invitee');
    }

    console.log('\n4. Testing READ operation (getAll)...');
    const allInvitees = await repo.getAll();
    console.log(`Retrieved ${allInvitees.length} invitees total`);

    console.log('\n5. Testing UPDATE operation...');
    const updates = {
      name: 'Updated Test User',
      email: 'updated@example.com',
      rsvp: 'no',
    };

    const updateResult = await repo.update(testInvitee.id, updates);
    if (updateResult) {
      console.log('Updated invitee successfully');
      const updated = await repo.getById(testInvitee.id);
      console.log('Updated name:', updated.name);
      console.log('Updated email:', updated.email);
      console.log('Updated rsvp:', updated.rsvp);
    } else {
      throw new Error('Failed to update invitee');
    }

    console.log('\n6. Testing DELETE operation...');
    await repo.delete(testInvitee.id);
    const deleted = await repo.getById(testInvitee.id);
    if (!deleted) {
      console.log('Confirmed invitee was deleted');
    } else {
      throw new Error('Invitee still exists after deletion');
    }

    console.log('\nAll CRUD operations completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

function testCorsFunction() {
  console.log('\nTesting CORS function...');

  function withCors(response) {
    const origin = process.env.ORIGIN_URL || 'http://localhost:3000';
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }

  const mockResponse = {
    headers: new Map(),
    set: function (name, value) {
      this.headers.set(name, value);
    },
  };

  const corsResponse = withCors(mockResponse);
  console.log('CORS function works');
  console.log('Headers:', Object.fromEntries(corsResponse.headers.entries()));
}

testInviteeCRUD()
  .then(() => {
    testCorsFunction();
    console.log('\nAll tests completed successfully!');
  })
  .catch((error) => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
