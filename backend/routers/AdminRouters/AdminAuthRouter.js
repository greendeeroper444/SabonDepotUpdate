const express = require('express');
const { loginAdmin, logoutAdmin, getDataAdmin } = require('../../controllers/AdminControllers/AdminAuthController');
const router = express.Router();


router.post('/loginAdmin', loginAdmin);
router.post('/logoutAdmin', logoutAdmin);
router.get('/getDataAdmin', getDataAdmin);


module.exports = router;