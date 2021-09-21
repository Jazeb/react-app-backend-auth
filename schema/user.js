const mongoose = require('mongoose').set('debug', true);
const Schema = mongoose.Schema;

const User = Schema({
    first_name:{
        type: String,
        required: false
    },
    last_name:{
        type: String,
        required: false
    },
    user_name:{
        type: String,
        required: true
    },
    is_verified: {
        type: Boolean,
        required: false,
        default: false
    },
    dob: {
        type: String,
        required: [false, 'DOB is required'],
    },
    fcm_token: {
        type: String,
        required: false,
        default: null
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    }
}, { collection: 'users' }, { __v: false });

module.exports = mongoose.model('users', User);