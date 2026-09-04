import { appendToGoogleSheet, UNIFIED_HEADERS } from './services/googleSheetsService.js';

console.log('Testing Unified Google Sheets connection...');
console.log('Standard Headers:', UNIFIED_HEADERS.join(' | '));

appendToGoogleSheet({
  source: 'Test Script (Verification)',
  name: 'Sample Lead (Verification)',
  phone1: '+91 9876543210',
  phone2: '+91 9123456789',
  email: 'lead@example.com',
  location: 'Jubilee Hills, Hyderabad',
  requirement: 'Full Home Interior (4BHK)',
  stage: 'Possession in 1-3 Months',
  materialDetails: 'Italian Marble, Veneer Panels',
  notes: 'Client requested comprehensive walkthrough and quotation.',
  ipAddress: '127.0.0.1'
})
.then(res => {
  if (res) {
    console.log('SUCCESS: Google Sheet row appended successfully. Result:', res);
  } else {
    console.log('NOTICE: Google credentials not configured yet. Follow the instructions to connect.');
  }
  process.exit(0);
})
.catch(err => {
  console.error('FAILURE: Error testing connection:', err);
  process.exit(1);
});
