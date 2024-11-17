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
    productName: { type: String }, 
    quantity: {
        type: Number,
        required: true,
    },
    finalPrice: { 
        type: Number 
    },
    sizeUnit: {
        type: String, //example: 'Milliliters (mL)', 'Liters (L)', 'Gallons (gal)'
    },
    productSize: {
        type: String, //example: '500 mL', '1 L', etc.
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
