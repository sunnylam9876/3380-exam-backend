const mongoose= require('mongoose');

//create Schemea
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: {type: String},
});

//create a collection called 300362757-sunny in MongoDB
const Book = mongoose.model("300362757-sunny", bookSchema);

module.exports = Book;