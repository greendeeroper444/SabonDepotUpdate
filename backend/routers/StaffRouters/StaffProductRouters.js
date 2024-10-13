const express = require('express');
const { uploadProductStaff, getProductStaff, deleteProductStaff, editProductStaff, getEditProductStaff, getProductShopStaff, getProductDetailsShopStaff, archiveProductStaff, getOutOfStockProducts } = require('../../controllers/StaffControllers/StaffProductController');
const router = express.Router();


router.post('/uploadProductStaff', uploadProductStaff);
router.get('/getProductStaff', getProductStaff);
router.delete('/deleteProductStaff/:productId', deleteProductStaff);
router.put('/editProductStaff/:productId', editProductStaff);
router.get('/getEditProductStaff/:productId', getEditProductStaff);

router.get('/getProductShopStaff', getProductShopStaff);
router.get('/getProductDetailsShopStaff/:productId', getProductDetailsShopStaff);
// router.get('/getUniqueCategoriesCustomer', getUniqueCategoriesCustomer);


router.put('/archiveProductStaff/:productId', archiveProductStaff);

router.get('/getOutOfStockProducts', getOutOfStockProducts);

module.exports = router;
