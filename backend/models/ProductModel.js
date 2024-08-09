const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema({
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
    discountPercentage: {
        type: Number,
        default: 0
    },
    discountedPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    uploaderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    uploaderType: {
        type: String,
        required: true,
        enum: ['Admin', 'Staff']
    },
    imageUrl: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: String,
        trim: true
    },
    updatedAt: {
        type: Date
    }
});

const ProductModel = mongoose.model('Product', ProductSchema);
module.exports = ProductModel;