const NotificationStaffModel = require("../../models/StaffModels/NotificationStaffModel");
const mongoose = require('mongoose')

//notification
const getNotificationsStaff = async(req, res) => {
    try {
        const notifications = await NotificationStaffModel.find({isRead: false}).sort({createdAt: -1});
        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Server error',
            error 
        });
    }
};

const markNotificationAsRead = async(req, res) => {
    const {id} = req.params;

    if(!id || !mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({ 
            message: 'Invalid notification ID' 
        });
    }

    try {
        const notification = await NotificationStaffModel.findByIdAndUpdate(
            id,
            {isRead: true},
            {new: true}
        );
        if(!notification){
            return res.status(404).json({ 
                message: 'Notification not found' 
            });
        }
        res.json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Server error', 
            error
        });
    }
};




module.exports = {
    getNotificationsStaff,
    markNotificationAsRead
}