const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    Name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
});

const userModel = mongoose.model('User', UserSchema);

module.exports = userModel;