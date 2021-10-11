const mongoose = require('mongoose');

const Author = mongoose.model('authors', {
    username: {
        type: String, 
        required: true,
        unique: [true, 'The username already exists']
    },
    password: {
        type: String, 
        required: true
    },
    blogs: {
        type: Array
    }
});

module.exports = Author;