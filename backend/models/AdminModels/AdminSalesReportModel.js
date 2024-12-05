const mongoose = require('mongoose');

const SalesReportSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    productCode: {
        type: String,
        required: true
    },
    sizeUnit: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
    },
    inventoryLevel: {
        type: Number,
        required: true
    },
    unitsSold: {
        type: Number,
        required: true
    },
    totalRevenue: {
        type: Number,
        required: true
    },
    initialQuantity: {
        type: Number,
        required: true
    },
    reportDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const SalesReportModel = mongoose.model('SalesReport', SalesReportSchema);
module.exports = SalesReportModel;