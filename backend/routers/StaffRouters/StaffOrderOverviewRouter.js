const express = require('express');
const { getBestSellingProducts } = require('../../controllers/StaffControllers/StaffOrderOverviewController');
const router = express.Router();


router.get('/getBestSellingProducts', getBestSellingProducts);


module.exports = router;