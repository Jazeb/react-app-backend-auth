require('dotenv').config();
const User = require('../schema/user');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendPasswordResetMail = email => {
    const num = Math.floor(Math.random() * 90000) + 10000;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text: `You reset password code is ${num}`
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) return reject(err);
            User.findOneAndUpdate({ email }, { $set: { reset_password_code: new_pwd } }).then(result => {
                if (!result) return resolve(false);
                return resolve(true);
            }).catch(err => reject(err));
        });
    });
}

const verifyAuthToken = data => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: data.email,
        subject: 'Verify Email',
        text: ``
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) return reject(err);
            return resolve(true);
        });
    });
}



module.exports = { sendPasswordResetMail, verifyAuthToken };