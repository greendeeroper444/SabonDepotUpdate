const express = require('express');
const { addOrderRefillStaff, getOrderRefillStaff, getAllOrderRefillStaff, updateOrderRefillStaff, getUpdateOrderRefillStaff } = require('../../controllers/StaffControllers/StaffOrdersRefillController');
const router = express.Router();

router.post('/addOrderRefillStaff', addOrderRefillStaff);
router.get('/getOrderRefillStaff/:staffId/:orderId?', getOrderRefillStaff);
router.get('/getAllOrderRefillStaff', getAllOrderRefillStaff);
router.put('/updateOrderRefillStaff/:orderId', updateOrderRefillStaff);
router.get('/getUpdateOrderRefillStaff/:orderId', getUpdateOrderRefillStaff);

module.exports = router;