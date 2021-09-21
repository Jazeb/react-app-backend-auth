require('dotenv');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const redis = require("redis");
const client = redis.createClient();

client.on("error", error => console.error(error));
client.on('connect', _ => console.log('REDIS connected...'));

const router = express.Router();

const resp = require('../resp');
const User = require('../schema/user');

const JWT_SECRET = process.env.JWT_SECRET;
const salt = bcrypt.genSaltSync(10);

const generateToken = user => jwt.sign(JSON.stringify(user), JWT_SECRET, { expiresIn: '1h' });

const hashPwd = password => bcrypt.hashSync(password, salt);

const saveInRedis = (key, token) => {
    client.set(key, token);
    client.expire(key, 1 * 60 * 60);
}

router.post('/signup', (req, res) => {
    const data = req.body;
    if (data.password) data.password = hashPwd(data.password);

    const user = new User(data);
    user.save((err, data) => {
        if (err) return resp.success(res, null, err.message);
        delete user.password
        const token = generateToken(data);
        saveInRedis(user.email, token);
        

        return resp.success(res, { user, token });
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return resp.error(res, 'Provide email and password');

    User.findOne({ email }).then(user => {
        if (!user) return resp.error(res, 'Invalid user');
        if (!bcrypt.compareSync(password, user.password)) return resp.error(res, 'Invalid password');

        const token = generateToken(user);
        saveInRedis(email, token);
        return resp.success(res, { user, token });
    }).catch(err => resp.error(res, err));
});

// Password reset API
router.post('/resetPassword', async (req, res) => {
    try {
        const { email, new_password, confirm_password } = req.body;
        if (!email || !new_password || !confirm_password) return resp.error(res, 'Provide new and confirm password');

        if (new_password !== confirm_password) return resp.error(res, 'Password does not match');

        const password = hashPwd(new_password);
        User.findOneAndUpdate({ email }, { password }).then(rs => {
            return resp.success(res, 'Password is updated.');
        }).catch(err => resp.error(res, err));

    } catch (error) {
        console.error(error);
        return resp.error(res, 'Error sending email');
    }
});

router.post('/refreshToken', (req, res) => {
    
});

module.exports = router;