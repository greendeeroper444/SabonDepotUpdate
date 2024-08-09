const express = require('express');
const { getAllAccountsAdmin, deleteAccountAdmin } = require('../../controllers/AdminControllers/AdminAccountsController');
const router = express.Router();


router.get('/getAllAccountsAdmin', getAllAccountsAdmin);
router.delete('/deleteAccountAdmin', deleteAccountAdmin);



module.exports = router;