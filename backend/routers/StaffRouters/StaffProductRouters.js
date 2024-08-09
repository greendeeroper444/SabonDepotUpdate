const express = require('express');
const { uploadProductStaff, getProductStaff, deleteProductStaff, editProductStaff, getEditProductStaff } = require('../../controllers/StaffControllers/StaffProductController');
const router = express.Router();


router.post('/uploadProductStaff', uploadProductStaff);
router.get('/getProductStaff', getProductStaff);
router.delete('/deleteProductStaff/:productId', deleteProductStaff);
router.put('/editProductStaff/:productId', editProductStaff);
router.get('/getEditProductStaff/:productId', getEditProductStaff);

module.exports = router;
