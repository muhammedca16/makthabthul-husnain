const db = require('../config/connection');
const collections = require('../config/collections');
const bcrypt = require('bcrypt');

module.exports = {
    // ലോഗിൻ പരിശോധിക്കാൻ
    doLogin: (adminData) => {
    return new Promise(async (resolve, reject) => {
        let response = {};
        // ഡാറ്റാബേസിൽ ഈ ഇമെയിൽ ഉണ്ടോ എന്ന് നോക്കുന്നു
        let admin = await db.get().collection(collections.ADMIN_COLLECTION).findOne({ Email: adminData.Email });

        if (admin) {
            // പാസ്‌വേഡ് ഹാഷ് മാച്ച് ചെയ്യുന്നുണ്ടോ എന്ന് നോക്കുന്നു
            bcrypt.compare(adminData.Password, admin.Password).then((status) => {
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