const cron = require('node-cron');
const ProductModel = require('../models/ProductModel');

//reset discounts daily
cron.schedule('0 0 * * *', async () => {
    const today = new Date();
    try {
        await ProductModel.updateMany(
            {discountedDate: {$lte: today}},
            {$set: {discountPercentage: 0, discountedPrice: price}}
        );
        console.log('Discounts reset for expired products.');
    } catch (error) {
        console.error('Error resetting discounts:', error);
    }
});
