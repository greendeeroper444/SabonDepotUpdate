const express = require('express');
const { uploadWorkinProgressProductAdmin, getWorkinProgressProductAdmin, deleteWorkinProgressProductAdmin, editWorkinProgressProductAdmin, getEditWorkinProgressProductAdmin, getWorkinProgressProductSummaryAdmin, getWorkinProgressOutOfStockProductsAdmin } = require('../../controllers/AdminControllers/AdminWorkinProgressProductController');
const router = express.Router();


router.post('/uploadWorkinProgressProductAdmin', uploadWorkinProgressProductAdmin);
router.get('/getWorkinProgressProductAdmin', getWorkinProgressProductAdmin);
router.delete('/deleteWorkinProgressProductAdmin/:productId', deleteWorkinProgressProductAdmin);
router.put('/editWorkinProgressProductAdmin/:productId', editWorkinProgressProductAdmin);
router.get('/getEditWorkinProgressProductAdmin/:productId', getEditWorkinProgressProductAdmin);
router.get('/getWorkinProgressProductSummaryAdmin', getWorkinProgressProductSummaryAdmin);

router.get('/getWorkinProgressOutOfStockProductsAdmin', getWorkinProgressOutOfStockProductsAdmin);

module.exports = router;
