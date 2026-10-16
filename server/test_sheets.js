import {
  appendToGoogleSheet,
  LEADS_SHEET_NAME,
  MATERIALS_SHEET_NAME,
  LEADS_HEADERS,
  MATERIALS_LEADS_HEADERS,
  isMaterialLead
} from './services/googleSheetsService.js';

console.log('====================================================');
console.log('ESPACIO Google Sheets Lead Routing Test');
console.log('====================================================');
console.log(`Sheet 1 (General Leads): "${LEADS_SHEET_NAME}"`);
console.log(`  Headers: ${LEADS_HEADERS.join(' | ')}`);
console.log(`Sheet 2 (Materials Leads): "${MATERIALS_SHEET_NAME}"`);
console.log(`  Headers: ${MATERIALS_LEADS_HEADERS.join(' | ')}`);
console.log('----------------------------------------------------\n');

async function runTests() {
  try {
    // 1. Test General Interior Lead -> Should route to "Leads"
    console.log('[Test 1] Testing General Interior Lead submission...');
    const generalPayload = {
      source: 'Contact Us (Consultation Form)',
      name: 'Rohan Sharma (Verification)',
      phone1: '+91 98765 43210',
      email: 'rohan.sharma@example.com',
      location: 'Jubilee Hills, Hyderabad',
      requirement: 'Turnkey Interiors',
      stage: 'Possession in 1-3 Months',
      notes: 'Interested in complete 4BHK turnkey interior design.',
      ipAddress: '127.0.0.1'
    };

    console.log('  isMaterialLead check:', isMaterialLead(generalPayload));
    const generalRes = await appendToGoogleSheet(generalPayload);
    console.log('  Result:', generalRes);

    console.log('\n----------------------------------------------------\n');

    // 2. Test Material Lead -> Should route to "Materials Leads"
    console.log('[Test 2] Testing Materials Lead submission...');
    const materialPayload = {
      source: 'Material Catalogue Request',
      name: 'Priya Patel (Verification)',
      phone1: '+91 91234 56789',
      email: 'priya.patel@example.com',
      location: 'Banjara Hills, Hyderabad',
      projectType: 'Catalogue Request',
      requirement: 'Materials',
      materialDetails: 'Polygranite Sheets, Fluted Panels',
      quantity: '50 Sheets',
      stage: 'Immediate (0-1 Month)',
      notes: 'Requested samples and wholesale pricing for polygranite sheets.',
      ipAddress: '127.0.0.1'
    };

    console.log('  isMaterialLead check:', isMaterialLead(materialPayload));
    const materialRes = await appendToGoogleSheet(materialPayload);
    console.log('  Result:', materialRes);

    console.log('\n====================================================');
    console.log('Verification Complete!');
    console.log('General Lead Target Sheet:', generalRes?.sheet, '| ID:', generalRes?.id);
    console.log('Material Lead Target Sheet:', materialRes?.sheet, '| ID:', materialRes?.id);
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('Test Error:', err);
    process.exit(1);
  }
}

runTests();
