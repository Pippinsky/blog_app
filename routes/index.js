const express = require('express');
const router = express.Router();
const { loadHomePage, loadAboutPage } = require('../controllers/general');
const { getAllBlogs, searchBlogs, getBlogsByCategory, getBlogBySlug, addBlog, deleteBlog } = require('../controllers/blogs');
const { registerNewAuthor, loginAuthor, logoutAuthor, viewAuthor, getAllAuthors } = require('../controllers/authors');
const { authenticateUser } = require('../middleware/auth')

const API_PREFIX = process.env.API_PREFIX;

// General routes
router.get('/', loadHomePage);
router.get('/about', loadAboutPage);


// Blog routes
router.post(`${API_PREFIX}/blogs/add-blog`, authenticateUser, addBlog);
router.get(`${API_PREFIX}/blogs`, getAllBlogs);
router.get(`${API_PREFIX}/blogs/search`, searchBlogs);
router.get(`${API_PREFIX}/blogs/:category`, getBlogsByCategory);
router.get(`${API_PREFIX}/blogs/:category/:slug`, getBlogBySlug);
router.delete(`${API_PREFIX}/blogs/:id`, deleteBlog);

// Author routes
router.get(`${API_PREFIX}/authors`, getAllAuthors);
router.post(`${API_PREFIX}/register`, registerNewAuthor);
router.post(`${API_PREFIX}/login`, loginAuthor);
router.get(`${API_PREFIX}/logout`, logoutAuthor);
// we want to view author info + blogs he added
router.get(`${API_PREFIX}/:author`, viewAuthor);

// Doesn't work for http://localhost:8080/blog-api/v1/_random-nonexisting-string_
router.use(`*`, (req, res) => {
    res.status(404).send('Route does not exist');
});

module.exports = router;