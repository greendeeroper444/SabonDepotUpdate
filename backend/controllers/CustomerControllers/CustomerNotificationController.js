const NotificationModel = require("../../models/NotificationModel");


const getNotifications = async(req, res) => {
    try {
        const {customerId} = req.params;
        const notifications = await NotificationModel.find({customerId}).sort({createdAt: -1});
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
};


const markNotificationAsRead = async(req, res) => {
    try {
        const {notificationId} = req.params;
        const updatedNotification = await NotificationModel.findByIdAndUpdate(
            notificationId,
            {isRead: true},
            {new: true}
        );

        if(!updatedNotification){
            return res.status(404).json({ 
                message: 'Notification not found' 
            });
        }

        res.status(200).json(updatedNotification);
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
};

module.exports = { 
    getNotifications, 
    markNotificationAsRead 
};
