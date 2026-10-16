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

// Sheet Names
export const LEADS_SHEET_NAME = process.env.GOOGLE_SHEETS_LEAD_SHEET_NAME || 'Leads';
export const MATERIALS_SHEET_NAME = process.env.GOOGLE_SHEETS_MATERIAL_SHEET_NAME || 'Materials Leads';

// Headers for General Leads sheet
export const LEADS_HEADERS = [
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

// Headers for Materials Leads sheet
export const MATERIALS_LEADS_HEADERS = [
  'Date & Time',
  'Lead ID',
  'Source / Form Type',
  'Customer Name',
  'Primary Phone',
  'Secondary Phone',
  'Email Address',
  'Project Location',
  'Material / Catalogue Details',
  'Quantity / Requirement',
  'Stage / Timeline',
  'Notes / Message',
  'Status',
  'IP Address'
];

// Preserved for backwards compatibility
export const UNIFIED_HEADERS = LEADS_HEADERS;

// Helper to authenticate with Google Sheets API (Service Account)
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

/**
 * Intelligent helper to identify whether a lead is regarding materials
 */
export const isMaterialLead = (data = {}) => {
  if (!data) return false;

  // 1. Explicit indicators
  if (data.isMaterials === true || data.isMaterial === true) return true;
  if (data.targetSheet && (data.targetSheet.toLowerCase().includes('material') || data.targetSheet === MATERIALS_SHEET_NAME)) return true;
  if (data.sheetName && (data.sheetName.toLowerCase().includes('material') || data.sheetName === MATERIALS_SHEET_NAME)) return true;

  // 2. Project type indicators
  const projectType = String(data.projectType || '').toLowerCase();
  if (projectType === 'materials' || projectType.includes('catalogue request')) return true;

  // 3. Requirement / Scope indicators
  const requirement = String(data.requirement || data.serviceType || data.spaces || '').toLowerCase();
  if (
    requirement === 'materials' ||
    requirement.includes('material') ||
    requirement.includes('panel') ||
    requirement.includes('sheet') ||
    requirement.includes('louver') ||
    requirement.includes('polygranite') ||
    requirement.includes('acrylic') ||
    requirement.includes('charcoal')
  ) {
    return true;
  }

  // 4. Source indicators
  const source = String(data.source || data['Source / Form Type'] || '').toLowerCase();
  if (source.includes('material') || source.includes('catalogue') || source.includes('catalog') || source.includes('sample')) {
    return true;
  }

  // 5. Material / catalogue details specified
  const catMaterial = String(data.catalogueMaterial || '').trim();
  if (catMaterial && catMaterial !== '-' && catMaterial !== 'N/A') return true;

  const matDetails = String(data.materialDetails || data['Material / Catalogue Details'] || '').trim();
  if (matDetails && matDetails !== '-' && matDetails !== 'N/A' && !matDetails.toLowerCase().includes('none')) {
    return true;
  }

  // 6. Selected categories or quantity
  if (data.productCategories && Array.isArray(data.productCategories) && data.productCategories.length > 0) return true;
  if (data.materialCategories && String(data.materialCategories) !== 'N/A' && String(data.materialCategories) !== '-') return true;

  return false;
};

/**
 * Generates the next sequential Lead ID for a sheet
 * e.g. MAT-000001 for Materials Leads, ESP-000001 for General Leads
 */
export const generateLeadId = (targetSheet, existingValues = []) => {
  const isMaterial = targetSheet === MATERIALS_SHEET_NAME || String(targetSheet).toLowerCase().includes('material');
  const prefix = isMaterial ? 'MAT-' : 'ESP-';

  let maxNum = 0;
  if (Array.isArray(existingValues) && existingValues.length > 0) {
    for (const row of existingValues) {
      const val = Array.isArray(row) ? row[0] : row;
      if (typeof val === 'string') {
        const match = val.match(/(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxNum) {
            maxNum = num;
          }
        }
      }
    }
  }

  if (maxNum > 0) {
    return `${prefix}${String(maxNum + 1).padStart(6, '0')}`;
  }

  return `${prefix}000001`;
};

// Helper to ensure a sheet exists and has headers
const ensureSheetExists = async (sheets, spreadsheetId, sheetName, headers) => {
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetExists = meta.data.sheets.some(
      s => s.properties.title.trim().toLowerCase() === sheetName.trim().toLowerCase()
    );

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
 * Appends a lead to either "Materials Leads" or "Leads" in Google Sheets.
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

    // Determine target sheet and prefix
    const isMaterial = isMaterialLead(data);
    const targetSheet = isMaterial ? MATERIALS_SHEET_NAME : LEADS_SHEET_NAME;
    const targetHeaders = isMaterial ? MATERIALS_LEADS_HEADERS : LEADS_HEADERS;
    const idPrefix = isMaterial ? 'MAT-' : 'ESP-';

    // Normalize field values
    const name = data.name || data.fullName || data['Customer Name'] || 'Valued Client';
    const phone1 = data.phone1 || data.phone || data.mobile || data['Primary Phone'] || data['Contact Number 1'] || '';
    const phone2 = data.phone2 || data['Secondary Phone'] || data['Contact Number 2'] || '';
    const email = data.email || data['Email Address'] || '';
    const location = data.location || data['Project Location'] || 'Hyderabad';
    const requirement = data.requirement || data.serviceType || data.spaces || data['Requirement / Space'] || data['Looking For'] || (isMaterial ? 'Materials Inquiry' : 'Interior Consultation');
    const stage = data.stage || data.timeline || data.budget || data['Stage / Timeline'] || data['Project Stage'] || '-';
    const materialDetails = data.materialDetails || data.catalogueMaterial || data.materialCategories || data['Material / Catalogue Details'] || (isMaterial ? requirement : '-');
    const quantity = data.quantity || data.approxQuantity || data['Quantity / Requirement'] || '-';
    const notes = data.notes || data.message || data['Notes / Message'] || data['Additional Notes'] || '-';
    const defaultSource = isMaterial ? 'Material Catalogue Request' : 'Website Lead';
    const source = data.source || data['Source / Form Type'] || data.Source || defaultSource;
    const status = data.status || 'NEW';
    const ipAddress = data.ipAddress || 'N/A';

    // Fallback Lead ID if webhook doesn't generate one
    const fallbackLeadId = data.leadId || `${idPrefix}${Math.floor(100000 + Math.random() * 900000)}`;

    // Build row array according to the target sheet
    let rowArray = [];
    if (isMaterial) {
      rowArray = [
        timestamp,
        fallbackLeadId,
        source,
        name,
        phone1,
        phone2,
        email,
        location,
        materialDetails,
        quantity,
        stage,
        notes,
        status,
        ipAddress
      ];
    } else {
      rowArray = [
        timestamp,
        fallbackLeadId,
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
    }

    const comprehensivePayload = {
      ...data,
      timestamp,
      date: timestamp,
      'Date & Time': timestamp,
      Timestamp: timestamp,
      Date: timestamp,
      targetSheet,
      sheetName: targetSheet,
      isMaterials: isMaterial,
      isMaterial,
      leadId: fallbackLeadId,
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
      stage,
      timeline: stage,
      'Stage / Timeline': stage,
      'Project Stage': stage,
      materialDetails,
      catalogueMaterial: materialDetails,
      'Material / Catalogue Details': materialDetails,
      quantity,
      approxQuantity: quantity,
      'Quantity / Requirement': quantity,
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

    // ── 1. Method A: Google Apps Script Webhooks ───────────────────────
    const webhookUrls = [
      process.env.GOOGLE_SHEETS_WEBHOOK_URL,
      process.env.VITE_GOOGLE_SHEET_WEBHOOK_URL
    ].filter(url => url && typeof url === 'string' && url.startsWith('http'));

    const uniqueWebhooks = [...new Set(webhookUrls)];

    if (uniqueWebhooks.length > 0) {
      let finalLeadId = fallbackLeadId;
      let anySuccess = false;
      for (const webhookUrl of uniqueWebhooks) {
        try {
          const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(comprehensivePayload),
            redirect: 'follow'
          });
          const resText = await res.text();
          let parsedData = {};
          try {
            parsedData = JSON.parse(resText);
          } catch {}
          if (parsedData.leadId) {
            finalLeadId = parsedData.leadId;
          }
          anySuccess = true;
          console.log(`Google Sheets: Successfully synced lead [${name}] to sheet "${targetSheet}" via Webhook (${webhookUrl.substring(0, 45)}...) (ID: ${finalLeadId})`);
        } catch (webhookErr) {
          console.warn(`Google Sheets Webhook sync error (${webhookUrl.substring(0, 45)}...):`, webhookErr.message);
        }
      }
      if (anySuccess) {
        return { success: true, id: finalLeadId, sheet: targetSheet, isMaterial, method: 'webhook' };
      }
    }

    // ── 2. Method B: Official Google Sheets API v4 (Service Account) ───
    const auth = getAuth();
    if (!auth) {
      console.warn('Google Sheets: No Google credentials found (GOOGLE_SHEETS_WEBHOOK_URL or GOOGLE_SERVICE_ACCOUNT_EMAIL & GOOGLE_PRIVATE_KEY or google-credentials.json).');
      return { success: true, id: fallbackLeadId, sheet: targetSheet, isMaterial, method: 'local_fallback' };
    }

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    if (!spreadsheetId) {
      console.warn('Google Sheets: GOOGLE_SHEETS_SPREADSHEET_ID not set in .env.');
      return { success: true, id: fallbackLeadId, sheet: targetSheet, isMaterial, method: 'local_fallback' };
    }

    // Ensure the required sheet exists
    await ensureSheetExists(sheets, spreadsheetId, targetSheet, targetHeaders);

    // Fetch existing Lead IDs from column B to determine next ID
    let nextId = `${idPrefix}000001`;
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${targetSheet}!B2:B`,
      });
      const rows = response.data.values;
      nextId = generateLeadId(targetSheet, rows);
    } catch (err) {
      console.warn(`Google Sheets API: Read error for ${targetSheet}, defaulting to ${nextId}. Error:`, err.message);
    }

    // Update Lead ID in rowArray
    rowArray[1] = nextId;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${targetSheet}!A:N`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowArray],
      },
    });

    console.log(`Google Sheets API: Appended row to "${targetSheet}" with ID ${nextId} (Source: ${source})`);
    return { success: true, id: nextId, sheet: targetSheet, isMaterial, method: 'service_account' };

  } catch (err) {
    console.error('Google Sheets Service Error:', err.message);
    return null;
  }
};
