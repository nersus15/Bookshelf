const { addBooks, getBookById, getBooks, updateBook, deleteBook } = require("./handler");

const routes = [
    {
        method: ['POST'],
        path: '/books',
        handler: addBooks
    },
    {
        method: ['GET'],
        path: '/books',
        handler: getBooks
    },
    {
        method: ['GET'],
        path: '/books/{id}',
        handler: getBookById
    },
    {
        method: ['PUT'],
        path: '/books/{id}',
        handler: updateBook
    },
    {
        method: ['DELETE'],
        path: '/books/{id}',
        handler: deleteBook
    }
];

module.exports = routes;