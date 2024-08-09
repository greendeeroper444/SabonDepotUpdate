const express = require('express');
const { registerCustomer, loginCustomer, logoutCustomer, verifyOtpCustomer, getDataCustomer, getOtpDetailsCustomer, updateProfileCustomer, getDataUpdateCustomer } = require('../../controllers/CustomerControllers/CustomerAuthController');



const router = express.Router();


router.post('/registerCustomer', registerCustomer);
router.post('/loginCustomer', loginCustomer);
router.post('/logoutCustomer', logoutCustomer);
router.post('/verifyOtpCustomer', verifyOtpCustomer);
router.post('/getOtpDetailsCustomer', getOtpDetailsCustomer);
router.get('/getDataCustomer', getDataCustomer);

//add more information customer
router.post('/updateProfileCustomer/:customerId', updateProfileCustomer);
router.get('/getDataUpdateCustomer/:customerId', getDataUpdateCustomer);


module.exports = router;