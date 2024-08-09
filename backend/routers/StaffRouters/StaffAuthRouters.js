const express = require('express');
const { loginStaff, logoutStaff, getDataStaff, updateProfileStaff, getDataUpdateStaff } = require('../../controllers/StaffControllers/StaffAuthController');

const router = express.Router();


router.post('/loginStaff', loginStaff);
router.post('/logoutStaff', logoutStaff);
router.get('/getDataStaff', getDataStaff);


//add more information staff
router.post('/updateProfileStaff/:staffId', updateProfileStaff);
router.get('/getDataUpdateStaff/:staffId', getDataUpdateStaff);

module.exports = router;