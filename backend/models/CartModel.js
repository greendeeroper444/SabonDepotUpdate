const mongoose = require('mongoose');


const CartSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
    },
    discountedPrice: { 
        type: Number 
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


const CartModel = mongoose.model('Cart', CartSchema);
module.exports = CartModel;
