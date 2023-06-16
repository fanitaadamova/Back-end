const Book = require('../models/Book');


exports.getAllBooks = () => Book.find();

exports.getBookById = (bookId) => Book.findById(bookId);

exports.updateBook = (bookId, data) => Book.findByIdAndUpdate(bookId, data);

exports.deleteBook = (bookId) => Book.findByIdAndDelete(bookId);

exports.wishBook = async (bookId, userId) => {
    const book = await Book.findById(bookId);
    if (book.wishingList.includes(userId)) {
        throw new Error('Product is alredy wish!');
    }

    book.wishingList.push(userId);
    await book.save();
}

exports.createBook = async (bookData) => {
    const book = new Book(bookData);
    await book.save();

    return book;

};

exports.hasWishes = async (userId, bookId) => {
    const book = await Book.findById(bookId);
    return book.wishingList.includes(userId);
};



