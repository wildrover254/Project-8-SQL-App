const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

function asyncHandler(cb){
    return async(req, res, next) => {
        try{
            await cb(req, res, next)
        } catch(error){
            next(error);
        }
    }
}

//Render Index with list of books   
router.get('/', asyncHandler(async(req, res, next) => {
    const books = await Book.findAll();
    res.render('index', {books}) ;
}));

//Render New Book Form
router.get('/new', (req, res) => {
    res.render('new-book', { book: {}, title: "New Book" });
});

//Post New Book to database, show validation errors if any
router.post('/', asyncHandler(async(req, res) => {
    let book;
    try {
        book = await Book.create(req.body);
        res.redirect('/');
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            res.render('new-book', { book, errors: error.errors, title: 'New Book' });
        } else {
            throw error;
        }
    }  
}));

//Render Form to Update Book
router.get('/:id', asyncHandler(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(book) {
        res.render('update-book', { book, title: "Update Book" });
    } else {
        res.sendStatus(404);
    }
}));

//Post an edit to the database, show validation errors if any
router.post('/:id/edit', asyncHandler(async(req,res) => {
    let book;
    try{
        book = await Book.findByPk(req.params.id);
        if(book) {
            await book.update(req.body);
            res.redirect('/');
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            book.id = req.params.id;
            res.render('update-book', { book, errors: error.errors, title: 'Update Book' });
        } else {
            throw error;
        }
    }
}));

//Delete a book from the database
router.post('/:id/delete', asyncHandler(async(req, res) => {
    let book;
    book = await Book.findByPk(req.params.id);
    if(book) {
        await book.destroy();
        res.redirect('/');
    } else {
        res.sendStatus(404);
    }
}));

module.exports = router;