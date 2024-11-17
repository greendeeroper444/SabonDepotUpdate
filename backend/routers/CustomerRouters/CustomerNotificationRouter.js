const express = require('express');
const { getNotifications, markNotificationAsRead } = require('../../controllers/CustomerControllers/CustomerNotificationController');
const router = express.Router();


router.get('/getNotifications/:customerId', getNotifications);
router.put('/markNotificationAsRead/:notificationId', markNotificationAsRead);

module.exports = router;
