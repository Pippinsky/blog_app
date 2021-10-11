const jwt = require('jsonwebtoken');

const getToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json('Invalid or missing token')
    }
    
    const token = authHeader.split(' ')[1];
    return token;
}

const authenticateUser = (req, res, next) => {
    const token = getToken(req);

    try {
        jwt.verify(token, process.env.JWT_SECRET);

        next();
    } catch (error) {
        return res.status(401).json('Not authorized')
    }
}

const decodeToken = (req, res, next) => {
    const token = getToken(req);
    const decodedToken = jwt.decode(token)
    return decodedToken;
}


module.exports = {
    authenticateUser,
    decodeToken
};