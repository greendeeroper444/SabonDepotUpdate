const express = require('express');
const { addProductToCartStaff, removeProductFromCartStaff, getProductCartStaff, updateProductQuantityStaff, updateProductSizeUnitAndProductSizeStaff } = require('../../controllers/StaffControllers/StaffCartController');

const router = express.Router();



router.post('/addProductToCartStaff', addProductToCartStaff);
router.get('/getProductCartStaff/:staffId', getProductCartStaff);
router.delete('/removeProductFromCartStaff/:cartItemId', removeProductFromCartStaff); 
router.put('/updateProductQuantityStaff', updateProductQuantityStaff);
// router.put('/updateProductSizeUnitAndProductSizeStaff', updateProductSizeUnitAndProductSizeStaff);
router.put('/updateCartItemSize', updateProductQuantityStaff); 

module.exports = router;