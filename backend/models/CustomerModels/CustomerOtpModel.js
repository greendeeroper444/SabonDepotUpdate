const mongoose = require('mongoose');


const CustomerOtpScheme = new mongoose.Schema({
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
    otp: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    expires: { 
        type: Date, 
        required: true,
        index: { 
            expireAfterSeconds: 300 
        } 
    }
})


const CustomerOtpModel = new mongoose.model('CustomerOtp', CustomerOtpScheme);
module.exports = CustomerOtpModel;