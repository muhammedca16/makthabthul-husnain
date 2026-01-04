const db = require('../config/connection');
const collections = require('../config/collections');
const bcrypt = require('bcrypt');

module.exports = {
    // ലോഗിൻ പരിശോധിക്കാൻ
    doLogin: (adminData) => {
    return new Promise(async (resolve, reject) => {
        let response = {};
        // ഇമെയിൽ തിരയുമ്പോൾ ചെറിയ അക്ഷരത്തിലുള്ള 'email' ഉപയോഗിക്കുക
        let admin = await db.get().collection(collections.ADMIN_COLLECTION).findOne({ email: adminData.Email });

        if (admin) {
            // പാസ്‌വേഡ് ചെക്ക് ചെയ്യുമ്പോഴും ചെറിയ അക്ഷരത്തിലുള്ള 'password' ഉപയോഗിക്കുക
            bcrypt.compare(adminData.Password, admin.password).then((status) => {
                if (status) {
                    response.admin = admin;
                    response.status = true;
                    resolve(response);
                } else {
                    console.log("Password mismatch");
                    resolve({ status: false });
                }
            });
        } else {
            console.log("Email not found in DB:", adminData.Email);
            resolve({ status: false });
        }
    });
}
};