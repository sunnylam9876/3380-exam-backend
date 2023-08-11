const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Book = require('./model/bookModel');      //Book schema

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());       //must have for json body

const BookData = require('./data/BookData');

//--------------------------------------------------------------------------------
//connection to MongoDB
//const uri = 'mongodb://127.0.0.1:27017/BookList';
const uri = 'mongodb+srv://twoods9876:12345@cluster0.2jurhdk.mongodb.net/BookList';
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfullly');
});
//--------------------------------------------------------------------------------
//REST API

//-----------------------------------------------------------------
//get all book information
app.get('/', (req, res) => {
    Book.find()
        .then((books) => {
            res.json(books);
            console.log("All books fetched");
        })
        .catch((err) => {
            res.status(400).json('Error: ' + err);
            console.log("Fetch all book data error");
        })
});

//-----------------------------------------------------------------



//-----------------------------------------------------------------
//get a book information by _id
app.get('/:id', (req, res) => {
    console.log('Getting book information..._id: ' + req.params.id);
    //Book.findById(req.params.id)

    Book.findById(req.params.id)
        .then((book) => {
            res.json(book)
            console.log("Book found: " + book)
        })
        .catch((err) => {
                res.status(400).json({message: 'Getting book has error: ', error: err})
        })
        
});


//-----------------------------------------------------------------
//add a new book to database
app.post('/', async (req, res) => {
    console.log("Adding new book....");

/*
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: {type: String},
*/
    const {title, author, description} = req.body;

    const newBook = new Book({
        title,
        author,
        description
    });

    await newBook
        .save()
        .then(() => {
            res.json({message: `Added new book, title: ${title}`});
            console.log('Added new book, title: ' + title);
        })
        .catch((err) => {
            res.status(400).json({message: 'Add book error: ', error: err});
            console.log('Add book error: ' + err);
        });    
});

//-----------------------------------------------------------------
//update a book information by Id
app.post('/:id', (req, res) => { 

    const {title, author, description} = req.body;

    console.log('Updating book information, BookId: ' + req.params.id);

    Book.findById(req.params.id)
        .then((bookForUpdate) => {
            bookForUpdate.title = title;
            bookForUpdate.author = author;
            bookForUpdate.description = description;            

            bookForUpdate
                .save()
                .then(() => res.json({message: 'Book updated'}))
                .catch((err) => {
                    res.status(400).json({message: `Erorr when udpating book, Id: ${req.params.id}`})
                    console.log("Error in updating book: " + err);
                } )
        })
        .catch((err) => {
            res.status(400).json({message: `Erorr when udpating book, Id: ${req.params.id}`})
            console.log("Error in updating book: " + err);
        });
});

//-----------------------------------------------------------------
//delete a book information by ID
app.delete('/:id', (req, res) => {
    console.log("Deleting book Id: " + req.params.id);
    Book.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(200).json('Book deleted.')
        })
        .catch((err) => {
            res.status(400).json({message: `Error when deleting book, Id: ${req.params.id}`})
        })
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

