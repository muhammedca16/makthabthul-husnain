const express = require('express');
const router = express.Router();
const bookHelpers = require('../helpers/book-helpers');
const categories = require('../config/categories'); // പാത്ത് ശ്രദ്ധിക്കുക

// ഹോം പേജ് റൂട്ട് (ഒറ്റ ഫംഗ്ഷൻ മാത്രം മതി)
router.get('/', (req, res) => {
        bookHelpers.getAllBooks().then((books) => {
        // ഇവിടെ books ഉം categories ഉം ഒരുപോലെ പാസ്സ് ചെയ്യുന്നു
        res.render('user/home', { books, categories });
    }).catch((err) => {
        console.log("Error loading books:", err);
        res.render('user/home', { books: [], categories });
    });
});

// കാറ്റഗറി റൂട്ട്
router.get('/category/:name', (req, res) => {
    let categoryName = decodeURI(req.params.name);
    
    console.log("Searching for category:", categoryName);

    bookHelpers.getBooksByCategory(categoryName).then((books) => {
        // ഇവിടെ 'categories' എന്ന് മാത്രം നൽകിയാൽ മതി
        res.render('user/home', { books, categories });
    }).catch((err) => {
        console.log("Category Error: ", err);
        res.redirect('/');
    });
});

module.exports = router;