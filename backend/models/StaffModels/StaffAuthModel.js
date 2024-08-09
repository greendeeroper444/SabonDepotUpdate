const mongoose = require('mongoose');


const StaffAuthSchema = new mongoose.Schema({
    profilePicture: {
        type: String,
        default: ''
    },
    fullName: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    nickName: {
        type: String,
        default: ''
    },
    contactNumber: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
})


const StaffAuthModel = mongoose.model('Staff', StaffAuthSchema);
module.exports = StaffAuthModel;