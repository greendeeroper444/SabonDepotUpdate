const mongoose = require('mongoose');


const CustomerAuthSchema = new mongoose.Schema({
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
    isNewCustomer: { //new field to track if customer is newly registered
        type: Boolean,
        default: true
    },
    newCustomerExpiresAt: { //new field to track expiry time of new customer status
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from registration
    }
})


const CustomerAuthModel = mongoose.model('Customer', CustomerAuthSchema);
module.exports = CustomerAuthModel;