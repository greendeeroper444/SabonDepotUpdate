const express = require('express');
const { getAllOrdersStaff, getOrderDetailsStaff } = require('../../controllers/StaffControllers/StaffOrdersController');

const router = express.Router();


router.get('/getAllOrdersStaff', getAllOrdersStaff);
router.get('/getOrderDetailsStaff/:orderId', getOrderDetailsStaff);


module.exports = router;