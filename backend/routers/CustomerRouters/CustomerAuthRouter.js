const express = require('express');
const { 
    registerCustomer, 
    loginCustomer, 
    logoutCustomer, 
    verifyOtpCustomer, 
    getDataCustomer, 
    getOtpDetailsCustomer, 
    updateProfileCustomer, 
    getDataUpdateCustomer, 
    requestPasswordReset, 
    resetPassword, 
    resendOtpCustomer
} = require('../../controllers/CustomerControllers/CustomerAuthController');



const router = express.Router();


router.post('/registerCustomer', registerCustomer);
router.post('/loginCustomer', loginCustomer);
router.post('/logoutCustomer', logoutCustomer);
router.post('/verifyOtpCustomer', verifyOtpCustomer);
router.post('/resendOtpCustomer', resendOtpCustomer);
router.post('/getOtpDetailsCustomer', getOtpDetailsCustomer);
router.get('/getDataCustomer', getDataCustomer);

//add more information customer
router.post('/updateProfileCustomer/:customerId', updateProfileCustomer);
router.get('/getDataUpdateCustomer/:customerId', getDataUpdateCustomer);

//new password reset routes
router.post('/requestPasswordReset', requestPasswordReset);
router.get('/resetPassword/:token', resetPassword);


module.exports = router;