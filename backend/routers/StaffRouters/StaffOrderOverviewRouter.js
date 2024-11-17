const express = require('express');
const { getBestSellingProducts, getTotalProductSales, getDeliveredPendingCanceled } = require('../../controllers/StaffControllers/StaffOrderOverviewController');
const router = express.Router();


router.get('/getBestSellingProducts', getBestSellingProducts);
router.get('/getTotalProductSales', getTotalProductSales);
router.get('/getDeliveredPendingCanceled', getDeliveredPendingCanceled);

module.exports = router;