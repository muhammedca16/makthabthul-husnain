const express = require('express');
const router = express.Router();
const bookHelpers = require('../helpers/book-helpers');
const adminHelpers = require('../helpers/admin-helpers');
const categories = require('../config/categories'); // പാത്ത് ശ്രദ്ധിക്കുക
// അഡ്മിൻ പേജുകൾക്ക് സുരക്ഷ നൽകാൻ ഒരു മിഡിൽവെയർ
const verifyLogin = (req, res, next) => {
    if (req.session && req.session.adminLoggedIn) {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

// പുസ്തകങ്ങളുടെ ലിസ്റ്റ് കാണാൻ
router.get('/',verifyLogin, (req, res) => {
    bookHelpers.getAllBooks().then((books) => {
        let bookCount = books.length;
        res.render('admin/view-books', { admin: true, books, bookCount });
    });
});

// പുതിയ പുസ്തകം ആഡ് ചെയ്യാനുള്ള പേജ്
router.get('/add-book',verifyLogin, (req, res) => {
    // കാറ്റഗറി ലിസ്റ്റ് കൂടി വ്യൂവിലേക്ക് അയക്കുന്നു
    res.render('admin/add-book', { admin: true, categories});
});

router.post('/add-book',verifyLogin, (req, res) => {
    bookHelpers.addBook(req.body).then(() => {
        res.redirect('/admin');
    });
});

// പുസ്തകം ഡിലീറ്റ് ചെയ്യാൻ
router.get('/delete-book/:id',verifyLogin, (req, res) => {
    let bookId = req.params.id;
    bookHelpers.deleteBook(bookId).then((response) => {
        // ഡിലീറ്റ് ആയിക്കഴിഞ്ഞാൽ തിരികെ അഡ്മിൻ ലിസ്റ്റിലേക്ക് തന്നെ പോകുന്നു
        res.redirect('/admin'); 
    }).catch((err) => {
        console.log("Delete Error:", err);
        res.redirect('/admin');
    });
});

// 1. എഡിറ്റ് ഫോം കാണിക്കാൻ
router.get('/edit-book/:id',verifyLogin, async (req, res) => {
    let book = await bookHelpers.getBookDetails(req.params.id);
    // അഡ്മിൻ പാനലിൽ 'الكل' (All) ഒഴിവാക്കി ബാക്കി കാറ്റഗറികൾ മാത്രം നൽകുന്നു
    let adminCategories = categories.filter(cat => cat.name !== 'الكل');
    res.render('admin/edit-book', { book, categories: adminCategories, admin: true });
});

// 2. അപ്ഡേറ്റ് ചെയ്ത വിവരങ്ങൾ സേവ് ചെയ്യാൻ
router.post('/edit-book/:id',verifyLogin, (req, res) => {
    bookHelpers.updateBook(req.params.id, req.body).then(() => {
        res.redirect('/admin');
    });
});

// ലോഗിൻ പേജ്
router.get('/login', (req, res) => {
    if (req.session.admin) {
        res.redirect('/admin');
    } else {
        res.render('admin/login', { "loginErr": req.session.adminLoginErr, admin: false });
        req.session.adminLoginErr = false;
    }
});

// ലോഗിൻ ആക്ഷൻ
router.post('/login', (req, res) => {
    adminHelpers.doLogin(req.body).then((response) => {
        if (response.status) {
            req.session.admin = response.admin;
            req.session.adminLoggedIn = true;
            res.redirect('/admin');
        } else {
            req.session.adminLoginErr = "Invalid Username or Password";
            res.redirect('/admin/login');
        }
    });
});

// ലോഗൗട്ട്
router.get('/logout',verifyLogin,(req, res) => {
    req.session.admin = null;
    res.redirect('/admin/login');
});

// ഇനി നിങ്ങളുടെ എല്ലാ അഡ്മിൻ റൂട്ടുകളിലും verifyLogin ചേർക്കുക
// ഉദാഹരണത്തിന്: router.get('/', verifyLogin, (req, res) => { ... })

module.exports = router;