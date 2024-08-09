const mongoose = require('mongoose');


const CustomerOtpScheme = new mongoose.Schema({
    fullName: { 
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