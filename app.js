const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const db = require('./config/connection');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const session = require('express-session');
const PORT = process.env.PORT || 3000;


const app = express();

// View engine setup
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, 'views/layouts/'),
    partialsDir: path.join(__dirname, 'views/partials/'),
    helpers: {
        addOne: (value) => value + 1 // ഇതാണ് ഇൻഡക്സിനെ 1 ആക്കി മാറ്റുന്നത്
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: "ca", // ഇഷ്ടമുള്ള ഒരു രഹസ്യവാക്ക് നൽകാം
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24 * 100, // കൃത്യം 30 ദിവസം
        secure: false // HTTPS ഇല്ലെങ്കിൽ false ആയി തന്നെ വയ്ക്കുക
    }
}));

// റൂട്ടുകൾ ഡാറ്റാബേസ് കണക്ഷന് വെളിയിൽ നൽകുക
app.use('/', userRouter);
app.use('/admin', adminRouter);

// Database connection
// ... ബാക്കി കോഡുകൾക്ക് താഴെ ...


db.connect((err) => {
    if (err) {
        console.log("Connection failed.." + err);
        process.exit(1); // കണക്ഷൻ പരാജയപ്പെട്ടാൽ പ്രോസസ്സ് നിർത്തുക
    } else {
        app.listen(PORT, () => {
            console.log(`🚀 Server started on port ${PORT}`);
        });
    }
});