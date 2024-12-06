const express = require('express');
const { getAllOrdersStaff, getOrderDetailsStaff, approveOrderStaff, updateOrderStatusStaff, getCompleteOrderTransactionStaff, createOrderStaff, getPosOrdersStaff, declineOrderStaff } = require('../../controllers/StaffControllers/StaffOrdersController');

const router = express.Router();


router.get('/getAllOrdersStaff', getAllOrdersStaff);
router.get('/getOrderDetailsStaff/:orderId', getOrderDetailsStaff);
router.put('/approveOrderStaff/:orderId', approveOrderStaff);
router.put('/updateOrderStatusStaff/:orderId', updateOrderStatusStaff); 
router.get('/getCompleteOrderTransactionStaff', getCompleteOrderTransactionStaff);
router.put('/declineOrderStaff/:orderId', declineOrderStaff);
// router.post('/createOrderStaff', createOrderStaff);
// router.get('/getPosOrdersStaff/:staffId/:orderId?', getPosOrdersStaff);
// router.get('/getOrderCustomer/:customerId/:orderId', getOrderCustomer)
// router.get('/getAllOrdersCustomer/:customerId', getAllOrdersCustomer)


module.exports = router;