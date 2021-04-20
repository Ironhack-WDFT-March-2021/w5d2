const router = require("express").Router();
const Book = require("../models/Book");
const Author = require("../models/Author");

router.get('/books', (req, res, next) => {
  // get all the books
  Book.find()
    .then(books => {
      console.log(books)
      // render a view books
      res.render('books', { booksList: books });
    }).catch(err => {
      next(err);
    })
})

router.post('/books', (req, res) => {
  // retrieve the fields from the request body
  console.log(req.body);
  const { title, author, description, rating } = req.body;
  // create a new document in the database
  Book.create({
    title: title,
    author: author,
    description: description,
    rating: rating
  })
    .then(bookFromDB => {
      console.log(`This book was just created ${bookFromDB}`);
      // res.render('bookDetails', { bookDetails: bookFromDB })
      // redirect to the details view of the book
      // this is how you do a redirect in express
      res.redirect(`/books/${bookFromDB._id}`);
    })
})

router.get('/books/edit/:id', (req, res, next) => {
  const bookId = req.params.id;
  Book.findById(bookId)
    .then(bookFromDB => {
      // console.log(bookFromDB);
      res.render('bookEdit', { book: bookFromDB });
    })
});


router.get('/books/add', (req, res) => {
  Author.find()
    .then(authorsFromDB => {
      console.log(authorsFromDB);
      res.render('bookForm', { authors: authorsFromDB });
    })
    .catch(err => {
      next(err);
    })
})

// shows the book details
router.get('/books/:id', (req, res, next) => {
  console.log(req.params.id)
  const bookId = req.params.id;
  // get the book with this id
  Book.findById(bookId).populate('author').then(book => {
    console.log(book);
    // render a details view with that book
    res.render('bookDetails.hbs', { bookDetails: book });
  })
    .catch(err => {
      next(err);
    })
})

router.get('/books/delete/:id', (req, res, next) => {
  const bookId = req.params.id;
  Book.findByIdAndDelete(bookId)
    .then(() => {
      res.redirect('/books');
    })
    .catch(err => {
      next(err);
    })
});


router.post('/books/edit/:id', (req, res, next) => {
  const bookId = req.params.id;
  const { title, author, description, rating } = req.body;
  Book.findByIdAndUpdate(bookId, {
    title: title,
    author: author,
    description: description,
    rating: rating
  })
    .then(book => {
      console.log(bookId)
      res.redirect(`/books/${book}`)
    })
    .catch(err => {
      next(err);
    })
});

router.post('/books/:id/reviews', (req, res, next) => {
  const bookId = req.params.id;
  const { user, comments } = req.body;
  console.log(user, comments);
  Book.findByIdAndUpdate(bookId, {
    $push: { reviews: { user: user, comments: comments } }
  })
    .then(() => {
      res.redirect(`/books/${bookId}`);
    })
    .catch(err => {
      next(err);
    })
})

module.exports = router;