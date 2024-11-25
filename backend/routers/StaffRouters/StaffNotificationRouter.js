const express = require('express');
const { getNotificationsStaff, markNotificationAsRead } = require('../../controllers/StaffControllers/StaffNotificationController');
const router = express.Router();

router.get('/getNotificationsStaff', getNotificationsStaff);
router.put('/markNotificationAsRead/:id', markNotificationAsRead);

module.exports = router;
