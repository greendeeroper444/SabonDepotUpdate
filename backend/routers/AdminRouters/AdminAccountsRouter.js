const express = require('express');
const { getAllAccountsAdmin, deleteAccountAdmin, getAllAccountDetailsAdmin } = require('../../controllers/AdminControllers/AdminAccountsController');
const router = express.Router();


router.get('/getAllAccountsAdmin', getAllAccountsAdmin);
router.get('/getAllAccountDetailsAdmin/:id', getAllAccountDetailsAdmin); 
router.delete('/deleteAccountAdmin', deleteAccountAdmin);



module.exports = router;