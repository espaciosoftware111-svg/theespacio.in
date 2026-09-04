import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure env is loaded regardless of execution cwd
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../client/.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

// Helper to authenticate with Google Sheets API
const getAuth = () => {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (email && privateKey) {
    privateKey = privateKey.replace(/\\n/g, '\n');
    return new google.auth.JWT({
      email,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
  }

  // Fallback to checking google-credentials.json in the server root
  const credentialsPath = path.resolve('google-credentials.json');
  if (fs.existsSync(credentialsPath)) {
    try {
      const creds = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
      if (creds.client_email && creds.private_key) {
        const formattedKey = creds.private_key.replace(/\\n/g, '\n');
        return new google.auth.JWT({
          email: creds.client_email,
          key: formattedKey,
          scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
      }
    } catch (err) {
      console.error('Google Sheets API: Error parsing credentials file:', err.message);
    }
  }

  return null;
};

// Unified Standard Headers for the single master sheet
export const UNIFIED_HEADERS = [
  'Date & Time',
  'Lead ID',
  'Source / Form Type',
  'Customer Name',
  'Primary Phone',
  'Secondary Phone',
  'Email Address',
  'Project Location',
  'Requirement / Space',
  'Stage / Timeline',
  'Material / Catalogue Details',
  'Notes / Message',
  'Status',
  'IP Address'
];

// Helper to ensure a sheet exists and has headers
const ensureSheetExists = async (sheets, spreadsheetId, sheetName, headers) => {
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetExists = meta.data.sheets.some(s => s.properties.title === sheetName);

    if (!sheetExists) {
      console.log(`Google Sheets: Sheet "${sheetName}" not found. Creating sheet...`);
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        },
      });

      // Write headers to row 1
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [headers],
        },
      });
      console.log(`Google Sheets: Created sheet "${sheetName}" and wrote header columns.`);
    }
  } catch (err) {
    console.error(`Google Sheets: Failed to verify/create sheet "${sheetName}":`, err.message);
  }
};

/**
 * Appends a lead to the unified Google Sheet.
 * Supports both:
 * 1. Google Apps Script Webhook (GOOGLE_SHEETS_WEBHOOK_URL and/or VITE_GOOGLE_SHEET_WEBHOOK_URL)
 * 2. Google Cloud Service Account API (GOOGLE_SERVICE_ACCOUNT_EMAIL & GOOGLE_PRIVATE_KEY or google-credentials.json)
 *
 * @param {string|object} typeOrData - Form data payload or type string
 * @param {object} [optionalData] - Form data payload if type passed first
 */
export const appendToGoogleSheet = async (typeOrData, optionalData) => {
  try {
    const data = (optionalData || (typeof typeOrData === 'object' ? typeOrData : {})) || {};
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const name = data.name || data.fullName || data['Customer Name'] || 'Valued Client';
    const phone1 = data.phone1 || data.phone || data.mobile || data['Primary Phone'] || data['Contact Number 1'] || '';
    const phone2 = data.phone2 || data['Secondary Phone'] || data['Contact Number 2'] || '';
    const email = data.email || data['Email Address'] || '';
    const location = data.location || data['Project Location'] || '';
    const requirement = data.requirement || data.serviceType || data.spaces || data['Requirement / Space'] || data['Looking For'] || '';
    const stage = data.stage || data.timeline || data.budget || data['Stage / Timeline'] || data['Project Stage'] || '';
    const materialDetails = data.materialDetails || data.catalogueMaterial || data['Material / Catalogue Details'] || '-';
    const notes = data.notes || data.message || data['Notes / Message'] || data['Additional Notes'] || '';
    const source = data.source || data['Source / Form Type'] || data.Source || 'Website Lead';
    const status = data.status || 'NEW';
    const ipAddress = data.ipAddress || 'N/A';

    const rowArray = [
      timestamp,
      data.leadId || '',
      source,
      name,
      phone1,
      phone2,
      email,
      location,
      requirement,
      stage,
      materialDetails,
      notes,
      status,
      ipAddress
    ];

    const comprehensivePayload = {
      ...data,
      timestamp,
      date: timestamp,
      'Date & Time': timestamp,
      Timestamp: timestamp,
      Date: timestamp,
      name,
      fullName: name,
      'Customer Name': name,
      'Full Name': name,
      Name: name,
      phone: phone1,
      phone1,
      phone2,
      mobile: phone1,
      'Primary Phone': phone1,
      'Contact Number 1': phone1,
      'Contact Number 2': phone2,
      'Secondary Phone': phone2,
      'Mobile Number': phone1,
      Phone: phone1,
      Mobile: phone1,
      email,
      'Email Address': email,
      Email: email,
      location,
      'Project Location': location,
      Location: location,
      requirement,
      spaces: requirement,
      serviceType: requirement,
      'Requirement / Space': requirement,
      'Looking For': requirement,
      'Spaces / Rooms': requirement,
      'Property Type': data.propertyType || 'Residential',
      stage,
      timeline: stage,
      'Stage / Timeline': stage,
      'Project Stage': stage,
      materialDetails,
      catalogueMaterial: materialDetails,
      'Material / Catalogue Details': materialDetails,
      'Catalogue Material': materialDetails,
      notes,
      message: notes,
      'Notes / Message': notes,
      'Additional Notes': notes,
      Notes: notes,
      Message: notes,
      source,
      'Source / Form Type': source,
      Source: source,
      status,
      Status: status,
      ipAddress,
      'IP Address': ipAddress,
      row: rowArray,
      values: rowArray,
      rowData: rowArray
    };

    // 1. Method A: Google Apps Script Webhooks
    const webhookUrls = [
      process.env.GOOGLE_SHEETS_WEBHOOK_URL,
      process.env.VITE_GOOGLE_SHEET_WEBHOOK_URL
    ].filter(url => url && typeof url === 'string' && url.startsWith('http'));

    const uniqueWebhooks = [...new Set(webhookUrls)];

    if (uniqueWebhooks.length > 0) {
      let leadId = 'ESP-000001';
      let anySuccess = false;
      for (const webhookUrl of uniqueWebhooks) {
        try {
          const response = await axios.post(webhookUrl, comprehensivePayload, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 25000,
            maxRedirects: 5
          });
          if (response.data?.leadId) {
            leadId = response.data.leadId;
          }
          anySuccess = true;
          console.log(`Google Sheets: Successfully synced lead [${data.name}] to Webhook URL (${webhookUrl.substring(0, 45)}...) (ID: ${leadId})`);
        } catch (webhookErr) {
          console.warn(`Google Sheets Webhook sync error (${webhookUrl.substring(0, 45)}...):`, webhookErr.message);
        }
      }
      if (anySuccess) {
        return { success: true, id: leadId, method: 'webhook' };
      }
    }

    // 2. Method B: Official Google Sheets API v4 (Service Account)
    const auth = getAuth();
    if (!auth) {
      console.warn('Google Sheets: No Google credentials found (GOOGLE_SHEETS_WEBHOOK_URL or GOOGLE_SERVICE_ACCOUNT_EMAIL & GOOGLE_PRIVATE_KEY or google-credentials.json).');
      return null;
    }

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    if (!spreadsheetId) {
      console.warn('Google Sheets: GOOGLE_SHEETS_SPREADSHEET_ID not set in .env.');
      return null;
    }

    const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || 'All Leads';
    await ensureSheetExists(sheets, spreadsheetId, sheetName, UNIFIED_HEADERS);

    // Fetch Lead IDs to determine next ID
    let nextId = 'ESP-000001';
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!B2:B`,
      });
      const rows = response.data.values;
      if (rows && rows.length > 0) {
        const lastIdStr = rows[rows.length - 1][0];
        if (lastIdStr && lastIdStr.startsWith('ESP-')) {
          const match = lastIdStr.match(/ESP-(\d+)/);
          if (match) {
            const num = parseInt(match[1], 10);
            nextId = `ESP-${String(num + 1).padStart(6, '0')}`;
          }
        }
      }
    } catch (err) {
      console.warn('Google Sheets API: Read error, defaulting to ESP-000001. Error:', err.message);
    }

    // Prepare unified row values matching UNIFIED_HEADERS
    const rowValues = [
      timestamp,
      nextId,
      data.source || 'Website Lead',
      data.name || 'N/A',
      data.phone1 || data.phone || 'N/A',
      data.phone2 || '',
      data.email || 'N/A',
      data.location || 'N/A',
      data.requirement || data.lookingFor || 'N/A',
      data.stage || data.projectStage || 'N/A',
      data.materialDetails || data.catalogueMaterial || '-',
      data.notes || data.message || 'None',
      data.status || 'NEW',
      data.ipAddress || 'N/A'
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:N`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowValues],
      },
    });

    console.log(`Google Sheets API: Appended row to "${sheetName}" with ID ${nextId} (Source: ${data.source || 'Website'})`);
    return { id: nextId, method: 'service_account' };

  } catch (err) {
    console.error('Google Sheets Service Error:', err.message);
    return null;
  }
};
