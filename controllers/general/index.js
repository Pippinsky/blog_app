const path = require('path');

const loadHomePage = (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, '../../views', 'index.html'))
}

const loadAboutPage = (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, '../../views', 'about.html'))
}

module.exports = {
    loadHomePage,
    loadAboutPage
}