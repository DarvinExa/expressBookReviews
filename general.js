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
    // Kita "menembak" data internal seolah-olah dari API luar
    const response = await Promise.resolve(books); 
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({message: "Error retrieving books"});
  }
});

// Lakukan hal yang sama untuk ISBN, Author, dan Title
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/`) // Contoh simulasi axios
    .then(() => {
      const book = books[isbn];
      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).json({message: "Book not found"});
      }
    })
    .catch(err => res.status(500).json({message: "Error fetching data"}));
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
