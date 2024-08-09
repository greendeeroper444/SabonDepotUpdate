const express = require('express');
const { getAllOrdersAdmin, getOrderDetailsAdmin } = require('../../controllers/AdminControllers/AdminOrdersController');

const router = express.Router();


router.get('/getAllOrdersAdmin', getAllOrdersAdmin);
router.get('/getOrderDetailsAdmin/:orderId', getOrderDetailsAdmin);


module.exports = router;