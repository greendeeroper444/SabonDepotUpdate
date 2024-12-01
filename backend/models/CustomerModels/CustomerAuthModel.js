const mongoose = require('mongoose');


const CustomerAuthSchema = new mongoose.Schema({
    profilePicture: {
        type: String,
        default: ''
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    middleInitial: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    barangay: {
        type: String,
        required: true
    },
    purokStreetSubdivision: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    clientType: {
        type: String,
        enum: ['Consumer', 'Associates'],
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    nickName: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    },
    isNewCustomer: { //new field to track if customer is newly registered
        type: Boolean,
        default: true
    },
    newCustomerExpiresAt: { //new field to track expiry time of new customer status
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from registration
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
})


const CustomerAuthModel = mongoose.model('Customer', CustomerAuthSchema);
module.exports = CustomerAuthModel;