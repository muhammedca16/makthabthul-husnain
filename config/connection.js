const MongoClient = require('mongodb').MongoClient;

const state = {
    db: null
};

module.exports.connect = function (done) {
    /**
     * മംഗോഡിബി അറ്റ്‌ലസിൽ നിന്ന് കിട്ടുന്ന ലിങ്ക് താഴെ നൽകുക.
     * <db_password> എന്ന ഭാഗം മാറ്റി ഇന്നലെ നിങ്ങൾ നൽകിയ പാസ്‌വേഡ് ടൈപ്പ് ചെയ്യുക.
     */
    const url = 'mongodb+srv://makthabathulhusnain:makthaba123@cluster0.4gald37.mongodb.net/?appName=Cluster0';
    const dbname = 'library';

    // ക്ലൗഡ് കണക്ഷൻ സ്റ്റേബിൾ ആകാൻ ഈ ഓപ്ഷനുകൾ സഹായിക്കും
    const options = {
        // വിഷ്വൽ എഡിറ്ററിൽ ടൈപ്പ് ചെയ്യുമ്പോൾ ഇവ ശ്രദ്ധിക്കുക
    };

    MongoClient.connect(url, options)
        .then((client) => {
            state.db = client.db(dbname);
            console.log("✅ SUCCESS: Makthaba Cloud Database Connected!");
            done();
        })
        .catch((err) => {
            console.log("❌ ERROR: Cloud Connection Failed!");
            console.error(err);
            done(err);
        });
};

module.exports.get = function () {
    return state.db;
};