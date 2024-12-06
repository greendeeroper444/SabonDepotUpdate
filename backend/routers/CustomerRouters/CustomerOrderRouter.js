const express = require('express');
const { createOrderCustomer, getOrderCustomer, getAllOrdersCustomer, uploadProof, receivedButton, createDirectOrderCustomer } = require('../../controllers/CustomerControllers/CustomerOrderController');

const router = express.Router();


router.post('/createOrderCustomer', createOrderCustomer);
router.post('/createDirectOrderCustomer', createDirectOrderCustomer);
router.get('/getOrderCustomer/:customerId/:orderId', getOrderCustomer)
router.get('/getAllOrdersCustomer/:customerId', getAllOrdersCustomer)
router.put('/uploadProof/:orderId', uploadProof);
router.put('/receivedButton/:orderId', receivedButton);

module.exports = router;