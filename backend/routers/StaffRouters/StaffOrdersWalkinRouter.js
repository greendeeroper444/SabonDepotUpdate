const express = require('express');
const { addOrderWalkinStaff, getOrderWalkinStaff, updateOrderWalkinStaff, getUpdateOrderWalkinStaff, getAllOrderWalkinStaff } = require('../../controllers/StaffControllers/StaffOrdersWalkinController');
const router = express.Router();

router.post('/addOrderWalkinStaff', addOrderWalkinStaff);
router.get('/getOrderWalkinStaff/:staffId/:orderId?', getOrderWalkinStaff);
router.get('/getAllOrderWalkinStaff', getAllOrderWalkinStaff);
router.put('/updateOrderWalkinStaff/:orderId', updateOrderWalkinStaff);
router.get('/getUpdateOrderWalkinStaff/:orderId', getUpdateOrderWalkinStaff);

module.exports = router;