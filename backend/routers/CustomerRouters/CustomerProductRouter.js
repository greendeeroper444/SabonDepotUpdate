const express = require('express');
const { getProductCustomer, getProductDetailsCustomer, getUniqueCategoriesCustomer } = require('../../controllers/CustomerControllers/CustomerProductController');

const router = express.Router();


router.get('/getProductCustomer', getProductCustomer);
router.get('/getProductDetailsCustomer/:productId', getProductDetailsCustomer);
router.get('/getUniqueCategoriesCustomer', getUniqueCategoriesCustomer);

module.exports = router;
