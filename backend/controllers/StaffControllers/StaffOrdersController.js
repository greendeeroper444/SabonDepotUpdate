const OrderModel = require("../../models/OrderModel");
const NotificationModel = require("../../models/NotificationModel");


const getAllOrdersStaff = async(req, res) => {
    try {
        const orders = await OrderModel.find().populate('customerId').populate('items.productId');
        res.json(orders);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}

const getOrderDetailsStaff = async(req, res) => {
    try {
        const {orderId} = req.params;
        const order = await OrderModel.findById(orderId)
        .populate('customerId')
        .populate('items.productId');

    if(!order){
        return res.status(404).json({ 
            message: 'Order not found' 
        });
    }

    res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
}

const approveOrderStaff = async(req, res) => {
    try {
        const {orderId} = req.params;
        const order = await OrderModel.findByIdAndUpdate(orderId, { 
            isConfirmed: true,
            orderStatus: 'Confirmed' 
        }, {new: true});

        if(!order){
            return res.status(404).json({ 
                message: 'Order not found' 
            });
        }

        await NotificationModel.create({
            customerId: order.customerId,
            orderId: order._id,
            message: `Your order ${order._id} has been confirmed.`,
        });

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
};

const updateOrderStatusStaff = async(req, res) => {
    try {
        const {orderId} = req.params;
        const {status} = req.body; //status will be one of 'isShipped', 'isOutForDelivery', 'isDelivered'

        //validate status
        if(!['isShipped', 'isOutForDelivery', 'isDelivered'].includes(status)){
            return res.status(400).json({
                message: 'Invalid status'
            });
        }

        const updateFields = {
            isShipped: status === 'isShipped' ? true : false,
            isOutForDelivery: status === 'isOutForDelivery' ? true : false,
            isDelivered: status === 'isDelivered' ? true : false,
        };

        //fetch the order from the database before proceeding
        const order = await OrderModel.findById(orderId);
        if(!order){
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        //set the date fields based on the status
        if(status === 'isShipped'){
            updateFields.shippedDate = Date.now();
            updateFields.orderStatus = 'Shipped';
            await NotificationModel.create({
                customerId: order.customerId,
                orderId: order._id,
                message: `Your order ${order._id} has been shipped.`,
            });
        } else if(status === 'isOutForDelivery'){
            updateFields.outForDeliveryDate = Date.now();
            updateFields.orderStatus = 'Out For Delivery';
            await NotificationModel.create({
                customerId: order.customerId,
                orderId: order._id,
                message: `Your order ${order._id} is out for delivery.`,
            });
        } 
        // else if(status === 'isDelivered'){
        //     updateFields.deliveredDate = Date.now();
        //     updateFields.orderStatus = 'Delivered';
        //     await NotificationModel.create({
        //         customerId: order.customerId,
        //         orderId: order._id,
        //         message: `Your order ${order._id} has been delivered.`,
        //     });
        // }
        else if(status === 'isDelivered'){
            updateFields.deliveredDate = Date.now();
            updateFields.orderStatus = 'Delivered';

            //mark the order as fully paid
            updateFields.overallPaid = order.totalAmount;
            updateFields.outstandingAmount = 0;
            updateFields.paymentStatus = 'Paid';
            updateFields.isFullPaidAmount = true;

            await NotificationModel.create({
                customerId: order.customerId,
                orderId: order._id,
                message: `Your order ${order._id} has been delivered.`,
            });
        }

        //update the order with the new status
        const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, updateFields, {new: true});

        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

const getCompleteOrderTransactionStaff = async(req, res) => {
    try {
        const orders = await OrderModel.find({
            // isFullPaidAmount: true,
            isConfirmed: true,
            isDelivered: true
        }).sort({createdAt: -1})

        if(orders.length === 0){
            return res.status(404).json({ 
                message: 'No complete transactions found' 
            });
        }


        res.status(200).json(orders);
    } catch (error) {
        console.log(first);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}


const declineOrderStaff = async(req, res) => {
    try {
        const {orderId} = req.params;

        // const order = await OrderModel.findByIdAndUpdate(orderId, {
        //     gcashPaid: 0,
        //     partialPayment: 0,
        //     referenceNumber: null,
        //     paymentProof: '',
        // }, {new: true});

        // if(!order){
        //     return res.status(404).json({ 
        //         message: 'Order not found' 
        //     });
        // }

        // Find the order to get the totalAmount for resetting outstandingAmount
        const order = await OrderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ 
                message: 'Order not found' 
            });
        }

        //update the fields for declining the order
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            orderId,
            {
                gcashPaid: 0,
                partialPayment: 0,
                referenceNumber: null,
                paymentProof: '',
                outstandingAmount: order.totalAmount,
                overallPaid: 0,
            },
            {new: true}
        );

        await NotificationModel.create({
            customerId: order.customerId,
            orderId: order._id,
            message: `Your order ${order._id} has been declined.`,
        });

        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
};


module.exports = {
    getAllOrdersStaff,
    getOrderDetailsStaff,
    approveOrderStaff,
    updateOrderStatusStaff,
    getCompleteOrderTransactionStaff,
    declineOrderStaff
    // createOrderStaff,
    // getPosOrdersStaff
}