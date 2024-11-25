const express = require('express');
const { createOrderCustomer, getOrderCustomer, getAllOrdersCustomer, uploadProof } = require('../../controllers/CustomerControllers/CustomerOrderController');

const router = express.Router();


router.post('/createOrderCustomer', createOrderCustomer);
router.get('/getOrderCustomer/:customerId/:orderId', getOrderCustomer)
router.get('/getAllOrdersCustomer/:customerId', getAllOrdersCustomer)
router.put('/uploadProof/:orderId', uploadProof);


module.exports = router;