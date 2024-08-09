const mongoose = require('mongoose');



const OrderWalkinSchema = new mongoose.Schema({
    productCode: {
        type: String,
        required: true,
        trim: true
    },
    productName: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
})

const OrderWalkinModel = mongoose.model('OrderWalkin', OrderWalkinSchema);
module.exports = OrderWalkinModel;