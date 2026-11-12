/**
 * Arenka Logistics — penerima data form ke Google Sheet.
 *
 * Cara pasang (sekali saja, di akun Google pemilik spreadsheet):
 * 1. Buka spreadsheet 'Form Arenkalogistics'.
 * 2. Menu Extensions > Apps Script.
 * 3. Hapus kode contoh, tempel seluruh isi file ini, lalu Save.
 * 4. Klik Deploy > New deployment > pilih type 'Web app'.
 *    - Description: Arenka lead form
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Klik Deploy, salin URL yang berakhiran '/exec'.
 * 6. Kirim URL itu agar dimasukkan ke ARENKA.leadSheetUrl di src/home.html.
 *
 * Baris di-upsert berdasarkan 'Lead ID', jadi pengisian sebagian lalu
 * lengkap tetap jadi satu baris yang terus diperbarui.
 */

var SHEET_ID = '1c_k05AK0fuHD85tj388Y74ue4IEiXQ5wlqUZxOBOkOE';
var SHEET_NAME = 'Sheet1';
var TZ = 'Asia/Jakarta';

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var data = {};
    try { data = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) { data = {}; }
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) { return json_({ ok: false, error: 'sheet not found' }); }
    var now = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm:ss');
    var leadId = String(data.leadId || '');
    var row = [
      now,
      leadId,
      String(data.status || ''),
      String(data.name || ''),
      String(data.intent || ''),
      String(data.need || ''),
      String(data.city || ''),
      String(data.message || ''),
      String(data.page || ''),
      String(data.referrer || ''),
      String(data.ua || '')
    ];
    var lastRow = sheet.getLastRow();
    var rowIndex = -1;
    if (leadId && lastRow >= 2) {
      var ids = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === leadId) { rowIndex = i + 2; break; }
      }
    }
    if (rowIndex > 0) { sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]); }
    else { sheet.appendRow(row); }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (err) {}
  }
}

function doGet() {
  return ContentService.createTextOutput('Arenka lead endpoint OK');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

