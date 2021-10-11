require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectToDb = require('./db/index');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app)

connectToDb()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        })
    })
    .catch((err) => {
        console.log(err);
    });