### Add the Author model 

```js
// models/Author.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const authorSchema = new Schema({
  name: String,
  lastName: String,
  nationality: String,
  birthday: Date,
  pictureUrl: String
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
```

### And in the Book model we refer in the author fiels now to the Author model 
```js
// models/Book.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: String,
  description: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author' // that is the name  of the model that this id refers to
  },
// other fields
```

### In the book details route we now use populate to replace the id with all the fields from the author document

```js
// routes/books.js
router.get('/books/:id', (req, res) => {
  const bookId = req.params.id;
  // get the book with this id
  // we need to call populate to replace the id of the author in the 'author' field
  // with all the information from the author model
  Book.findById(bookId)
    .populate('author')
    .then(book => {
      console.log(book);
      // render a book details view
      res.render('bookDetails', { bookDetails: book });
    })
})
```

### In the book add view we want to render a dropdown with all the authors 

### We need to get all the authors in the route and pass it into the view

```js
// routes/books.js
router.get('/books/add', (req, res) => {
  // to render the select we also need all the authors in the view
  Author.find()
    .then(authorsFromDB => {
      res.render('bookForm', { authors: authorsFromDB });
    })
    .catch(err => {
      console.log(err);
    })
})
```

### And in the view we render a select

```html
// views/bookForm.hbs
  <select name="author" id="">
    {{#each authors}}
      <option value="{{this._id}}">{{this.name}} {{this.lastName}}</option>
    {{/each}}
  </select>
```

### We add reviews to the Book model
```js
// models/Book.js
const bookSchema = new Schema({
  // other fields
  reviews: [
    {
      user: String,
      comments: String
    }
  ]
});
```

### Now we want to be able to add reviews for a book

### First we change the Book model

```js
// models/Book.js
const bookSchema = new Schema({
  // other fields
  reviews: [
    {
      user: String,
      comments: String
    }
  ]
```

### In the view we add the logic to display and add the review

```html
{{!-- List the reviews --}}
<h3>Reviews</h3>
{{#if bookDetails.reviews}}
{{#each bookDetails.reviews}}
<div>
  <p>{{this.comments}}</p>
  <span>{{this.user}}</span>
</div>
{{/each}}
{{/if}}


{{!-- Add a review --}}
{{#with bookDetails}}
<p>Add a review</p>
<form action="/books/{{_id}}/reviews" method="POST">
  <label for="">User: </label>
  <input type="text" name="user">
  <label for="">Comments: </label>
  <input type="text" name="comments">
  <button type="submit">Add this review</button>
</form>
{{/with}}
```

### Finally let's add the route to add a review to the reviews array - we have to use $push here

```js
// routes/books.js
router.post('/books/:id/reviews', (req, res) => {
  const bookId = req.params.id;
  const user = req.body.user;
  const comments = req.body.comments;
  console.log(user, comments);
  // const { user, comments } = req.body;
  // here we add the reviews from the form to the reviews array in the book document
  Book.findByIdAndUpdate(bookId, { $push: { reviews: { user: user, comments: comments } } })
    .then(() => {
      res.redirect(`/books/${bookId}`);
    })
    .catch(err => {
      console.log(err);
    })
})
```