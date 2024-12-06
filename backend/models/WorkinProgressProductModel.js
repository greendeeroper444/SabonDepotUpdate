const mongoose = require('mongoose');


const WorkinProgressProductSchema = new mongoose.Schema({
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
    sizeUnit: {
        type: String, //example: 'Milliliters (mL)', 'Liters (L)', 'Gallons (gal)'
    },
    productSize: {
        type: String, //example: '500 mL', '1 L', etc.
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
    isArchived:{
        type: Boolean,
        default: false,
    },
    expirationDate: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        required: true,
        trim: true
    },
    updatedBy: {
        type: String,
        trim: true
    },
}, {timestamps: true});

const WorkinProgressProductModel = mongoose.model('WorkinProgressProduct', WorkinProgressProductSchema);
module.exports = WorkinProgressProductModel;