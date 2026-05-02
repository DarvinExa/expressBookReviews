const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Required for Tasks 10-13

// --- Tasks 1-6 logic remains here (Registration, etc.) ---

// Task 10: Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
    try {
        // Simulating an asynchronous call to fetch books
        const getBooks = () => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(books), 100);
            });
        };
        const bookList = await getBooks();
        res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error fetching book list" });
    }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBookByISBN = new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject({ status: 404, message: "Book not found" });
            }
        }, 100);
    });

    getBookByISBN
        .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
        .catch((err) => res.status(err.status).json({ message: err.message }));
});

// Task 12: Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const getBooksByAuthor = await new Promise((resolve, reject) => {
            setTimeout(() => {
                const keys = Object.keys(books);
                const filteredBooks = keys
                    .filter(key => books[key].author === author)
                    .map(key => ({ isbn: key, ...books[key] }));
                
                if (filteredBooks.length > 0) {
                    resolve(filteredBooks);
                } else {
                    reject({ status: 404, message: "Author not found" });
                }
            }, 100);
        });
        res.status(200).send(JSON.stringify(getBooksByAuthor, null, 4));
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
});

// Task 13: Get book details based on title using async-await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const getBooksByTitle = await new Promise((resolve, reject) => {
            setTimeout(() => {
                const keys = Object.keys(books);
                const filteredBooks = keys
                    .filter(key => books[key].title === title)
                    .map(key => ({ isbn: key, ...books[key] }));
                
                if (filteredBooks.length > 0) {
                    resolve(filteredBooks);
                } else {
                    reject({ status: 404, message: "Title not found" });
                }
            }, 100);
        });
        res.status(200).send(JSON.stringify(getBooksByTitle, null, 4));
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
});

module.exports.general = public_users;
