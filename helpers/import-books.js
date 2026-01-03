const csv = require('csvtojson');
const db = require('../config/connection');
const collections = require('../config/collections');

module.exports = {
    importFromCSV: (filePath) => {
        csv().fromFile(filePath).then((jsonObj) => {
            // jsonObj-ൽ നിങ്ങളുടെ ഷീറ്റിലെ എല്ലാ വിവരങ്ങളും ഉണ്ടാകും
            db.get().collection(collections.BOOK_COLLECTION).insertMany(jsonObj);
            console.log("3000+ Books Imported Successfully!");
        });
    }
} 