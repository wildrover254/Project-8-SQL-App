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

//Post New Book to database
router.post('/', asyncHandler(async(req, res) => {
    let book = await Book.create(req.body);
    res.redirect('/');
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

router.post('/:id/edit', asyncHandler(async(req,res) => {
    let book = await Book.findByPk(req.params.id);
    if(book) {
        await book.update(req.body);
        res.redirect('/');
    } else {
        res.sendStatus(404);
    }
}));

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