const mongoose = require('mongoose');

const SalesOverviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        unique: true,
    },
    productName: {
        type: String,
        required: true,
    },
    totalProduct: {
        type: Number,
        default: 0,
    },
    totalSales: {
        type: Number,
        default: 0,
    },
    quantitySold: {
        type: Number,
        default: 0,
    },
    sizeUnit: {
        type: String, 
    },
    productSize: {
        type: String,
    },
    lastSoldAt: {
        type: Date,
    },
}, {timestamps: true});

const SalesOverviewModel = mongoose.model('SalesOverview', SalesOverviewSchema)

module.exports = SalesOverviewModel
