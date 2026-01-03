const mongoClient = require('mongodb').MongoClient;

const state = {
    db: null
};

module.exports.connect = function (done) {
    // നിങ്ങളുടെ അറ്റ്ലസ് ലിങ്ക് ഇവിടെ നൽകുക
    const url = 'mongodb+srv://makthabathulhusnain:makthaba123@cluster0.4gald37.mongodb.net/?appName=Cluster0';
    const dbname = 'library'; 

    // { useUnifiedTopology: true } എന്നത് ഒഴിവാക്കുക
    mongoClient.connect(url, (err, data) => {
        if (err) return done(err);
        state.db = data.db(dbname);
        console.log("Database Connected Successfully to Atlas");
        done();
    });
};

module.exports.get = function () {
    return state.db;
};