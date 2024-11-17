const express = require('express');
const { getAllAccountsStaff, deleteAccountStaff } = require('../../controllers/StaffControllers/StaffAccountsController');

const router = express.Router();


router.get('/getAllAccountsStaff', getAllAccountsStaff);
router.delete('/deleteAccountStaff', deleteAccountStaff);



module.exports = router;