const conn = require('../config/connection');

(async () => {
  try {
    await conn.connect();
    const db = conn.get();
    if (!db) {
      console.error('No DB connection available');
      process.exit(1);
    }

    const cols = await db.listCollections().toArray();
    console.log('Collections:');
    cols.forEach(c => console.log('- ' + c.name));
    process.exit(0);
  } catch (err) {
    console.error('Error listing collections:');
    console.error(err);
    process.exit(1);
  }
})();
