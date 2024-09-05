const mongoose = require('mongoose');


const StaffCartSchema = new mongoose.Schema({
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Staff'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        required: true,
    },
    finalPrice: { 
        type: Number 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});


const StaffCartModel = mongoose.model('StaffCart', StaffCartSchema);
module.exports = StaffCartModel;
