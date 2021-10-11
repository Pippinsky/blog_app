const mongoose = require('mongoose');

const Blog = mongoose.model('blog', {
    author: {
        type: String
    },
    title: {
        type: String, required: [true, 'Title must be provided']
    },
    slug: {
        type: String, unique: [true, 'The slug already exists']
    },
    category: {
        type: String, required: true
    },
    content: {
        type: String, required: true
    },
    publishedDate: {
        type: Date,
        default: Date.now()
    }
})

module.exports = Blog;