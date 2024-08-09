const express = require('express');
const { addProductToCartCustomer, getProductCartCustomer, removeProductFromCartCustomer } = require('../../controllers/CustomerControllers/CustomerCartController');


const router = express.Router();



router.post('/addProductToCartCustomer', addProductToCartCustomer);
router.get('/getProductCartCustomer/:customerId', getProductCartCustomer);
router.delete('/removeProductFromCartCustomer/:cartItemId', removeProductFromCartCustomer); 


module.exports = router;