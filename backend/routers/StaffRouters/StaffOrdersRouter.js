const express = require('express');
const { getAllOrdersStaff, getOrderDetailsStaff, approveOrderStaff, updateOrderStatusStaff } = require('../../controllers/StaffControllers/StaffOrdersController');

const router = express.Router();


router.get('/getAllOrdersStaff', getAllOrdersStaff);
router.get('/getOrderDetailsStaff/:orderId', getOrderDetailsStaff);
router.put('/approveOrderStaff/:orderId', approveOrderStaff);
router.put('/updateOrderStatusStaff/:orderId', updateOrderStatusStaff); 


module.exports = router;