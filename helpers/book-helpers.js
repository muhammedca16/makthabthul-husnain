const db = require('../config/connection');
const collections = require('../config/collections');
const csv = require('csvtojson');
const { ObjectId } = require('mongodb');

module.exports = {
    importBooks: (filePath) => {
    return new Promise((resolve, reject) => {
        const database = db.get();
        if (!database) {
            return reject("Database not initialized. Please wait a moment.");
        }

        csv().fromFile(filePath).then((books) => {
            database.collection(collections.BOOK_COLLECTION).insertMany(books)
                .then(() => resolve("All books imported!"))
                .catch((err) => reject(err));
        });
    });
},

    // 3000 ബുക്സ് ഉള്ളതുകൊണ്ട് ഒരു സെർച്ച് ഫംഗ്ഷൻ അത്യാവശ്യമാണ്
    searchBooks: (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            let books = await db.get().collection(collections.BOOK_COLLECTION)
                .find({
                    $or: [
                        { book_name: { $regex: query, $options: 'i' } }, // പേരിൽ തിരയുന്നു
                        { author: { $regex: query, $options: 'i' } }    // രചയിതാവിൽ തിരയുന്നു
                    ]
                })
                .sort({ book_name: 1 })
                .toArray();
            resolve(books);
        } catch (err) {
            reject(err);
        }
    });
},
    getAllBooks: () => {
    return new Promise(async (resolve, reject) => {
        try {
            // collections.BOOK_COLLECTION തന്നെ ഉപയോഗിക്കുക
            let books = await db.get().collection(collections.BOOK_COLLECTION).find().toArray();
            resolve(books);
        } catch (err) {
            reject(err);
        }
    });
},
getBooksByCategory: (catName) => {
    return new Promise(async (resolve, reject) => {
        try {
            let books = await db.get().collection(collections.BOOK_COLLECTION)
                .find({ category: catName })
                .sort({ book_name: 1 }) // അക്ഷരമാലാക്രമത്തിൽ
                .toArray();
            resolve(books);
        } catch (err) {
            reject(err);
        }
    });
},
addBook: (book) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.BOOK_COLLECTION).insertOne(book).then((data) => {
                resolve(data);
            });
        });
    },

    // പുസ്തകം ഡിലീറ്റ് ചെയ്യാൻ
    deleteBook: (bookId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.BOOK_COLLECTION)
                .deleteOne({ _id: new ObjectId(bookId) })
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    // ഒരു പുസ്തകത്തിന്റെ മാത്രം വിവരങ്ങൾ എടുക്കാൻ
    getBookDetails: (bookId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.BOOK_COLLECTION).findOne({ _id: new ObjectId(bookId) }).then((book) => {
                resolve(book);
            });
        });
    },

    // പുസ്തകം അപ്‌ഡേറ്റ് ചെയ്യാൻ
    updateBook: (bookId, bookDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.BOOK_COLLECTION)
                .updateOne({ _id: new ObjectId(bookId) }, {
                    $set: {
                        book_name: bookDetails.book_name,
                        author: bookDetails.author,
                        category: bookDetails.category,
                        vol: bookDetails.vol,
                        publishers: bookDetails.publishers
                    }
                }).then((response) => {
                    resolve();
                });
        });
    }
}