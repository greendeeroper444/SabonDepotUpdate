const mongoose = require('mongoose');

const BaseProductSchema = new mongoose.Schema({
    productCode: String,
    productName: String,
    category: String,
    price: Number,
    discountPercentage: Number,
    discountedPrice: Number,
    sizeUnit: String,
    productSize: String,
    imageUrl: String,
    uploaderId: mongoose.Schema.Types.ObjectId,
    uploaderType: String,
    createdBy: String,
    updatedBy: String,
}, {discriminatorKey: 'productType'});

const BaseProduct = mongoose.model('BaseProduct', BaseProductSchema);

module.exports = BaseProduct;
