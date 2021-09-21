const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const salt = bcrypt.genSaltSync(10);

const generateToken = user => jwt.sign(JSON.stringify(user), JWT_SECRET);
const hashPwd = password => bcrypt.hashSync(password, salt);

const verifyToken = token => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, result) => {
            if (err) return (reject(err));
            return resolve(result)
        });
        
    });
}

module.exports = { generateToken, hashPwd, verifyToken }