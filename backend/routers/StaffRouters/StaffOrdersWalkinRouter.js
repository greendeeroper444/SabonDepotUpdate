const express = require('express');
const { addOrderWalkinStaff, getOrderWalkinStaff, updateOrderWalkinStaff, getUpdateOrderWalkinStaff } = require('../../controllers/StaffControllers/StaffOrdersWalkinController');
const router = express.Router();

router.post('/addOrderWalkinStaff', addOrderWalkinStaff);
router.get('/getOrderWalkinStaff', getOrderWalkinStaff);
router.put('/updateOrderWalkinStaff/:orderId', updateOrderWalkinStaff);
router.get('/getUpdateOrderWalkinStaff/:orderId', getUpdateOrderWalkinStaff);

module.exports = router;