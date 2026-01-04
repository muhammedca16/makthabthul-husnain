const path = require('path');
const conn = require('../config/connection');
const importer = require('../helpers/import-books');

(async () => {
  try {
    await conn.connect();
    const filePath = path.join(__dirname, '..', 'books.csv');
    console.log('Importing from', filePath);
    const res = await importer.importFromCSV(filePath);
    console.log('Import result:', res && res.insertedCount ? `${res.insertedCount} inserted` : 'No rows');
    process.exit(0);
  } catch (err) {
    console.error('Import failed:');
    console.error(err);
    process.exit(1);
  }
})();
