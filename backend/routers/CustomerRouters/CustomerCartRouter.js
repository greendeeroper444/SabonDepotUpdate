const express = require('express');
const { addProductToCartCustomer, getProductCartCustomer, removeProductFromCartCustomer, updateProductQuantity } = require('../../controllers/CustomerControllers/CustomerCartController');


const router = express.Router();



router.post('/addProductToCartCustomer', addProductToCartCustomer);
router.get('/getProductCartCustomer/:customerId', getProductCartCustomer);
router.delete('/removeProductFromCartCustomer/:cartItemId', removeProductFromCartCustomer); 
router.put('/updateProductQuantity/:cartItemId', updateProductQuantity);

module.exports = router;