const express = require('express');
const { addProductToCartStaff, removeProductFromCartStaff, getProductCartStaff } = require('../../controllers/StaffControllers/StaffCartController');

const router = express.Router();



router.post('/addProductToCartStaff', addProductToCartStaff);
router.get('/getProductCartStaff/:staffId', getProductCartStaff);
router.delete('/removeProductFromCartStaff/:cartItemId', removeProductFromCartStaff); 


module.exports = router;