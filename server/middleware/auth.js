const jwt = require('jsonwebtoken')
const ENV = require('../config')

async function auth(req, res, next) {
    try {
        // access authorize header to validate request
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        // retrive the user details fo the logged in user
        const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);

        req.user = decodedToken;
        // res.status(201).json({ decodedToken })
        next()
    } catch (error) {
        return res.status(401).json({ error })
    }
}

async function localVaribles(req, res, next) {
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next()
}

module.exports = { auth, localVaribles } 