/**
 * ==================================================================================================
 * ESPACIO - Google Sheets Lead Synchronization Webhook
 * Spreadsheet: https://docs.google.com/spreadsheets/d/1JF4G9WIcdz4V0YSHbgyUHHS8lU6K_hx-nghmbArBB1U/edit
 * ==================================================================================================
 * 
 * This Google Apps Script automatically handles:
 * 1. Creating the 2 dedicated sheets:
 *    - "Materials Leads" (for material inquiries, catalogue unlocks, and sample requests)
 *    - "Leads" (for turnkey interior, renovation, design, and consultation requests)
 * 2. Generating sequential Lead IDs for each sheet:
 *    - Materials Leads: MAT-000001, MAT-000002, MAT-000003...
 *    - General Leads:   ESP-000001, ESP-000002, ESP-000003...
 * 3. Thread-safe lock handling with LockService so concurrent submissions never duplicate IDs.
 * 4. Automatic migration helper: running "setupSheets()" migrates any existing leads from Sheet1
 *    into "Materials Leads" and "Leads" automatically!
 * 
 * --------------------------------------------------------------------------------------------------
 * HOW TO APPLY TO YOUR SHEET (1-Minute Instructions):
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1JF4G9WIcdz4V0YSHbgyUHHS8lU6K_hx-nghmbArBB1U/edit
 * 2. Click "Extensions" > "Apps Script" in the top menu.
 * 3. Select all existing code (Ctrl+A), delete it, and paste this entire file.
 * 4. Click the "Save" (disk icon).
 * 5. In the function dropdown at the top, select "setupSheets" and click "Run".
 *    (Authorize permissions if prompted — this instantly creates both "Materials Leads" and "Leads" sheets!).
 * 6. Click "Deploy" > "Manage deployments".
 * 7. Click the pencil (Edit) icon:
 *    - Version: select "New version"
 *    - Who has access: "Anyone"
 *    - Click "Deploy".
 * ==================================================================================================
 */

var SHEET_NAMES = {
  MATERIALS: 'Materials Leads',
  LEADS: 'Leads'
};

var HEADERS = {
  LEADS: [
    'DATE AND TIME',
    'Lead ID',
    'Source / Form Type',
    'Customer Name',
    'Primary Phone',
    'Secondary Phone',
    'Email Address',
    'Project Location',
    'Requirement / Space',
    'Property Type / Scope',
    'Stage / Budget',
    'Notes / Details',
    'Status'
  ],
  MATERIALS: [
    'DATE AND TIME',
    'Lead ID',
    'Source / Form Type',
    'Customer Name',
    'Primary Phone',
    'Secondary Phone',
    'Email Address',
    'Project Location',
    'Material / Catalogue Details',
    'Quantity / Requirement',
    'Stage / Budget',
    'Notes / Details',
    'Status'
  ]
};

/**
 * Adds an "ESPACIO" custom menu to Google Sheets upon opening
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('ESPACIO')
    .addItem('Initialize / Setup Both Sheets', 'setupSheets')
    .addToUi();
}

/**
 * Creates both "Materials Leads" and "Leads" sheets with stylized headers
 * and migrates existing data from the initial sheet.
 */
function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var leadsSheet = getOrCreateSheet(ss, SHEET_NAMES.LEADS, HEADERS.LEADS);
  var materialsSheet = getOrCreateSheet(ss, SHEET_NAMES.MATERIALS, HEADERS.MATERIALS);

  // Check if there is an original sheet with existing rows to migrate
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var curSheet = sheets[i];
    var curName = curSheet.getName();
    if (curName !== SHEET_NAMES.LEADS && curName !== SHEET_NAMES.MATERIALS) {
      migrateExistingData(ss, curSheet, leadsSheet, materialsSheet);
    }
  }

  Logger.log('Setup finished: "Materials Leads" and "Leads" sheets are active and configured.');
}

/**
 * Migrates existing rows from an unseparated sheet into the new 2 sheets
 */
function migrateExistingData(ss, sourceSheet, leadsSheet, materialsSheet) {
  var lastRow = sourceSheet.getLastRow();
  if (lastRow <= 1) return; // Only header or empty

  var data = sourceSheet.getRange(2, 1, lastRow - 1, sourceSheet.getLastColumn()).getValues();
  if (!data || data.length === 0) return;

  var matCount = 0;
  var leadCount = 0;

  for (var r = 0; r < data.length; r++) {
    var row = data[r];
    var timestamp = row[0] || '';
    var id = row[1] || '';
    var source = row[2] || '';
    var name = row[3] || '';
    var phone1 = row[4] || '';
    var phone2 = row[5] || '';
    var email = row[6] || '';
    var location = row[7] || '';
    var reqOrMat = row[8] || '';
    var propOrQty = row[9] || '';
    var stage = row[10] || '';
    var notes = row[11] || '';
    var status = row[12] || 'NEW';

    var rowText = (String(source) + ' ' + String(reqOrMat) + ' ' + String(propOrQty) + ' ' + String(notes)).toLowerCase();
    var isMaterial = rowText.includes('material') || rowText.includes('catalogue') || rowText.includes('catalog') || rowText.includes('sample') || rowText.includes('panel') || rowText.includes('sheet');

    if (isMaterial) {
      var nextMatId = generateNextLeadId(materialsSheet, 'MAT-');
      materialsSheet.appendRow([
        timestamp,
        id && id.startsWith('MAT-') ? id : nextMatId,
        source || 'Material Inquiry',
        name,
        phone1,
        phone2,
        email,
        location,
        reqOrMat,
        propOrQty,
        stage,
        notes,
        status
      ]);
      matCount++;
    } else {
      var nextLeadId = generateNextLeadId(leadsSheet, 'ESP-');
      leadsSheet.appendRow([
        timestamp,
        id && id.startsWith('ESP-') ? id : nextLeadId,
        source || 'Website Lead',
        name,
        phone1,
        phone2,
        email,
        location,
        reqOrMat,
        propOrQty,
        stage,
        notes,
        status
      ]);
      leadCount++;
    }
  }

  // Rename source sheet to archive once migrated
  try {
    sourceSheet.setName(sourceSheet.getName() + ' (Archive)');
  } catch (e) {}

  Logger.log('Migrated ' + matCount + ' material leads and ' + leadCount + ' general leads.');
}

/**
 * Helper to get or create a sheet with formatted headers
 */
function getOrCreateSheet(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    var sheets = ss.getSheets();
    for (var i = 0; i < sheets.length; i++) {
      if (sheets[i].getName().trim().toLowerCase() === sheetName.trim().toLowerCase()) {
        sheet = sheets[i];
        break;
      }
    }
  }

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  // Insert and style headers if missing
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);

    // Style Header Row: Charcoal/Dark Blue background, White text, Bold, Centered
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#1E232A');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontWeight('bold');
    headerRange.setFontFamily('Roboto');
    headerRange.setFontSize(10);
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    sheet.setRowHeight(1, 36);
    sheet.setFrozenRows(1);

    // Auto-fit column widths
    for (var col = 1; col <= headers.length; col++) {
      sheet.autoResizeColumn(col);
    }
  }

  return sheet;
}

/**
 * Determines whether incoming lead data is a materials lead
 */
function isMaterialLead(data) {
  if (!data) return false;

  if (data.isMaterials === true || data.isMaterial === true) return true;
  if (data.targetSheet && (data.targetSheet.toLowerCase().includes('material') || data.targetSheet === SHEET_NAMES.MATERIALS)) return true;
  if (data.sheetName && (data.sheetName.toLowerCase().includes('material') || data.sheetName === SHEET_NAMES.MATERIALS)) return true;

  var projectType = String(data.projectType || '').toLowerCase();
  if (projectType === 'materials' || projectType.includes('catalogue request')) return true;

  var requirement = String(data.requirement || data.serviceType || data.spaces || '').toLowerCase();
  if (
    requirement === 'materials' ||
    requirement.includes('material') ||
    requirement.includes('panel') ||
    requirement.includes('sheet') ||
    requirement.includes('louver') ||
    requirement.includes('polygranite') ||
    requirement.includes('acrylic')
  ) {
    return true;
  }

  var source = String(data.source || data['Source / Form Type'] || '').toLowerCase();
  if (source.includes('material') || source.includes('catalogue') || source.includes('catalog') || source.includes('sample')) {
    return true;
  }

  var catMaterial = String(data.catalogueMaterial || '').trim();
  if (catMaterial && catMaterial !== '-' && catMaterial !== 'N/A') return true;

  var matDetails = String(data.materialDetails || data['Material / Catalogue Details'] || '').trim();
  if (matDetails && matDetails !== '-' && matDetails !== 'N/A' && !matDetails.toLowerCase().includes('none')) {
    return true;
  }

  if (data.productCategories && Array.isArray(data.productCategories) && data.productCategories.length > 0) return true;
  if (data.materialCategories && String(data.materialCategories) !== 'N/A' && String(data.materialCategories) !== '-') return true;

  return false;
}

/**
 * Generates the next sequential Lead ID for a sheet
 * (e.g., MAT-000001 for Materials Leads, ESP-000001 for Leads)
 */
function generateNextLeadId(sheet, prefix) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return prefix + '000001';
  }

  var maxIdNum = 0;
  var idValues = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
  for (var i = 0; i < idValues.length; i++) {
    var cellValue = String(idValues[i][0] || '').trim();
    if (cellValue) {
      var match = cellValue.match(/(\d+)/);
      if (match) {
        var num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxIdNum) {
          maxIdNum = num;
        }
      }
    }
  }

  var nextNum = maxIdNum + 1;
  var paddedNum = ('000000' + nextNum).slice(-6);
  return prefix + paddedNum;
}

/**
 * GET health check endpoint
 */
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var materialsSheet = ss.getSheetByName(SHEET_NAMES.MATERIALS);
  var leadsSheet = ss.getSheetByName(SHEET_NAMES.LEADS);

  var info = {
    status: 'active',
    message: 'ESPACIO Leads Webhook is Live',
    spreadsheetName: ss.getName(),
    sheets: {
      materialsLeads: {
        name: SHEET_NAMES.MATERIALS,
        exists: !!materialsSheet,
        totalLeads: materialsSheet ? Math.max(0, materialsSheet.getLastRow() - 1) : 0
      },
      leads: {
        name: SHEET_NAMES.LEADS,
        exists: !!leadsSheet,
        totalLeads: leadsSheet ? Math.max(0, leadsSheet.getLastRow() - 1) : 0
      }
    },
    timestamp: new Date().toISOString()
  };

  return ContentService.createTextOutput(JSON.stringify(info))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * POST endpoint for receiving form submissions from the website
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  var hasLock = false;

  try {
    hasLock = lock.waitLock(10000);
  } catch (lockErr) {
    Logger.warn('Lock wait timeout: ' + lockErr.message);
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var postData = {};

    if (e && e.postData && e.postData.contents) {
      try {
        postData = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        if (e.parameter) postData = e.parameter;
      }
    } else if (e && e.parameter) {
      postData = e.parameter;
    }

    var isMaterial = isMaterialLead(postData);
    var targetSheetName = isMaterial ? SHEET_NAMES.MATERIALS : SHEET_NAMES.LEADS;
    var targetHeaders = isMaterial ? HEADERS.MATERIALS : HEADERS.LEADS;
    var idPrefix = isMaterial ? 'MAT-' : 'ESP-';

    var sheet = getOrCreateSheet(ss, targetSheetName, targetHeaders);

    // Generate unique sequential Lead ID
    var leadId = generateNextLeadId(sheet, idPrefix);

    // Format timestamp in Indian Standard Time (dd/MM/yyyy, hh:mm:ss a)
    var timestamp = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd/MM/yyyy, hh:mm:ss a');

    // Extract fields
    var name = postData.name || postData.fullName || postData['Customer Name'] || 'Valued Client';
    var phone1 = postData.phone1 || postData.phone || postData.mobile || postData['Primary Phone'] || '';
    var phone2 = postData.phone2 || postData['Secondary Phone'] || '';
    var email = postData.email || postData['Email Address'] || '';
    var location = postData.location || postData['Project Location'] || 'Hyderabad';
    var requirement = postData.requirement || postData.serviceType || postData.spaces || postData['Requirement / Space'] || (isMaterial ? 'Materials Inquiry' : 'Turnkey Interiors');
    var stage = postData.stage || postData.timeline || postData.budget || postData['Stage / Budget'] || postData['Stage / Timeline'] || '-';
    var materialDetails = postData.materialDetails || postData.catalogueMaterial || postData.materialCategories || postData['Material / Catalogue Details'] || (isMaterial ? requirement : '-');
    var quantity = postData.quantity || postData.approxQuantity || postData['Quantity / Requirement'] || '-';
    var notes = postData.notes || postData.message || postData['Notes / Details'] || postData['Notes / Message'] || '-';
    var source = postData.source || postData['Source / Form Type'] || (isMaterial ? 'Material Catalogue Request' : 'Website Lead');
    var status = postData.status || 'NEW';

    var rowValues = [];
    if (isMaterial) {
      // Materials Leads Layout (13 Columns):
      // DATE AND TIME | Lead ID | Source / Form Type | Customer Name | Primary Phone | Secondary Phone | Email Address | Project Location | Material / Catalogue Details | Quantity / Requirement | Stage / Budget | Notes / Details | Status
      rowValues = [
        timestamp,
        leadId,
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
        status
      ];
    } else {
      // General Leads Layout (13 Columns):
      // DATE AND TIME | Lead ID | Source / Form Type | Customer Name | Primary Phone | Secondary Phone | Email Address | Project Location | Requirement / Space | Property Type / Scope | Stage / Budget | Notes / Details | Status
      var propertyScope = postData.propertyType || postData['Property Type / Scope'] || '-';
      rowValues = [
        timestamp,
        leadId,
        source,
        name,
        phone1,
        phone2,
        email,
        location,
        requirement,
        propertyScope,
        stage,
        notes,
        status
      ];
    }

    sheet.appendRow(rowValues);

    var responsePayload = {
      success: true,
      leadId: leadId,
      sheet: targetSheetName,
      isMaterial: isMaterial,
      message: 'Lead recorded successfully in ' + targetSheetName,
      timestamp: timestamp
    };

    return ContentService.createTextOutput(JSON.stringify(responsePayload))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.error('ESPACIO Webhook Error: ' + error.message);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    if (hasLock) {
      lock.releaseLock();
    }
  }
}
