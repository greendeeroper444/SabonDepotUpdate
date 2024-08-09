const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            productCode: String,
            productName: String,
            category: String,
            price: Number,
            discountPercentage: Number,
            discountedPrice: Number,
            quantity: Number,
            uploaderId: mongoose.Schema.Types.ObjectId,
            uploaderType: String,
            imageUrl: String,
            createdProductBy: String,
            createdProductAt: Date,
            updatedProductBy: String,
            updatedProductAt: Date,
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    billingDetails: {
        fullName: {type: String, required: true},
        nickName: {type: String},
        address: {type: String, required: true},
        city: {type: String, required: true},
        contactNumber: {type: String, required: true},
        emailAddress: {type: String, required: true},
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending',
    },
    orderStatus: {
        type: String,
        enum: ['On Delivery', 'Delivered', 'Under Review', 'Cancelled'],
        default: 'On Delivery',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
});


const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel;
