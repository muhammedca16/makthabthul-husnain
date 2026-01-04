const csv = require('csvtojson');
const db = require('../config/connection');
const collections = require('../config/collections');

module.exports = {
    importFromCSV: async (filePath) => {
        const jsonObj = await csv().fromFile(filePath);
        if (!jsonObj || !jsonObj.length) return { insertedCount: 0 };

        const result = await db.get().collection(collections.BOOK_COLLECTION).insertMany(jsonObj);
        console.log(`${result.insertedCount} Books Imported Successfully!`);
        return result;
    }
};