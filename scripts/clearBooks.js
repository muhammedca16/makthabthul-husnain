const conn = require('../config/connection');

async function usage() {
  console.log('Usage: node scripts/clearBooks.js --drop|--dedupe');
  console.log('  --drop   : Drop the entire `books` collection (destructive)');
  console.log('  --dedupe : Remove duplicate documents grouped by `book_name` + `author`');
  process.exit(1);
}

(async () => {
  const arg = process.argv[2];
  if (!arg) return usage();

  try {
    await conn.connect();
    const db = conn.get();
    const col = db.collection('books');

    if (arg === '--drop') {
      console.log('This will DROP the entire `books` collection.');
      console.log('If you are sure, re-run with the same flag.');
      // double-check interactive confirmation
      const confirmed = process.env.CONFIRM === 'yes';
      if (!confirmed) {
        console.log('To actually perform the drop, set environment variable CONFIRM=yes');
        console.log('Example: CONFIRM=yes node scripts/clearBooks.js --drop');
        process.exit(0);
      }

      const exists = await col.countDocuments();
      if (exists === 0) {
        console.log('Collection is already empty. Nothing to drop.');
        process.exit(0);
      }
      await col.drop();
      console.log('Dropped `books` collection.');
      process.exit(0);
    }

    if (arg === '--dedupe') {
      console.log('Scanning for duplicates grouped by `book_name` + `author` ...');
      const pipeline = [
        { $group: { _id: { book_name: '$book_name', author: '$author' }, ids: { $push: '$_id' }, count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } }
      ];

      const groups = await col.aggregate(pipeline).toArray();
      if (!groups.length) {
        console.log('No duplicates found.');
        process.exit(0);
      }

      let totalRemoved = 0;
      for (const g of groups) {
        const ids = g.ids;
        // keep the earliest inserted (ObjectId's timestamp) -> smallest _id
        ids.sort();
        ids.shift(); // remove first from deletion list
        const res = await col.deleteMany({ _id: { $in: ids } });
        totalRemoved += res.deletedCount || 0;
      }

      console.log(`Deduplication complete. Removed ${totalRemoved} duplicate documents.`);
      process.exit(0);
    }

    return usage();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
