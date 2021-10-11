const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Author = require('../../models/authors');


const getAllAuthors = async (req, res, next) => {
    // add admin permissions to access authors or smthng - sensitive info

    try {
        const allAuthors = await Author.find();
        return res.status(200).json(allAuthors)
    } catch (error) {
        return res.status(500).json(error)
    }
}


const registerNewAuthor = async (req, res, next) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(401).json('Invalid credentials')
    }

    try {
        // Check if the author already exists
        const user = await Author.findOne({username});
        if(user) {
            return res.status(401).json('User with the same name already exists')
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newAuthor = await Author.create( {username, password: encryptedPassword} );
        return res.status(201).json(`Author created ${newAuthor}`);

    } catch (error) {
        return res.status(500).json(error);
    }
};


const loginAuthor = async (req, res, next) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(401).json('username or password is missing')
    }

    try {
        const login = await Author.find({username});
        // console.log(login);
        if(!login) {
            return res.status(401).json("user doesn't exist");
        }
        
        const passMatch = await bcrypt.compare(password, login[0].password);


        // const userId = login._id;
        // console.log(obj)
        // console.log(`the id is ${userId}`);

        if(passMatch) {
            const [ obj ] = login;
            const userId = obj._id;

            const token = jwt.sign(
                { username: username, id: userId },
                process.env.JWT_SECRET,
            );

            // aim: add the blog ID in the author's blogs when posting a blog

            return res.status(200).json(`Correct login info. The token is ${token}`)
        } else {
            return res.status(401).json('incorrect password')
        }
    } catch (error) {
        return res.status(500).json(`there's been an error: ${error}`)
    }
};

const logoutAuthor = async (req, res, next) => {
    delete req.headers['authorization'];
    res.status(200).json('You\'ve been logged out');
}

const viewAuthor = async (req, res, next) => {
    const author = req.params.author;
    try {
        const authorInfo = await Author.find({username: {
            $regex: new RegExp('^' + author.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i')
            // only need case insensitivity here - how to apply?
        }});
        res.status(200).json(authorInfo)
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports = {
    registerNewAuthor,
    loginAuthor,
    logoutAuthor,
    viewAuthor,
    getAllAuthors
}