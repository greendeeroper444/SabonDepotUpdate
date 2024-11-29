const OrderModel = require("../../models/OrderModel");
const StaffAuthModel = require("../../models/StaffModels/StaffAuthModel");
const StaffCartModel = require("../../models/StaffModels/StaffCartModel");
const jwt = require('jsonwebtoken');
const StaffOrderWalkinModel = require("../../models/StaffModels/StaffOrderWalkinModel");
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


// const updateOrderStatusStaff = async(req, res) => {
//     try {
//         const {orderId} = req.params;
//         const {status} = req.body; //status will be one of 'isShipped', 'isOutForDelivery', 'isDelivered'

//         //validate status
//         if(!['isShipped', 'isOutForDelivery', 'isDelivered'].includes(status)){
//             return res.status(400).json({ 
//                 message: 'Invalid status' 
//             });
//         }

//         const updateFields = {
//             isShipped: status === 'isShipped' ? true : false,
//             isOutForDelivery: status === 'isOutForDelivery' ? true : false,
//             isDelivered: status === 'isDelivered' ? true : false,
//         };

//         // set the date fields based on the status
//         // if(status === 'isShipped'){
//         //     updateFields.shippedDate = Date.now();
//         // } else if(status === 'isOutForDelivery'){
//         //     updateFields.outForDeliveryDate = Date.now();
//         // } else if(status === 'isDelivered'){
//         //     updateFields.deliveredDate = Date.now();
//         // }
//         if (status === 'isShipped') {
//             updateFields.shippedDate = Date.now();
//             updateFields.orderStatus = 'Shipped'; 
//             await NotificationModel.create({
//                 customerId: order.customerId,
//                 orderId: order._id,
//                 message: `Your order ${order._id} has been shipped.`,
//             });
//         } else if (status === 'isOutForDelivery') {
//             updateFields.outForDeliveryDate = Date.now();
//             updateFields.orderStatus = 'Out For Delivery';
//             await NotificationModel.create({
//                 customerId: order.customerId,
//                 orderId: order._id,
//                 message: `Your order ${order._id} is out for delivery.`,
//             });
//         } else if (status === 'isDelivered') {
//             updateFields.deliveredDate = Date.now();
//             updateFields.orderStatus = 'Delivered';
//             await NotificationModel.create({
//                 customerId: order.customerId,
//                 orderId: order._id,
//                 message: `Your order ${order._id} has been delivered.`,
//             });
//         }
        
//         const order = await OrderModel.findByIdAndUpdate(orderId, updateFields, {new: true});

//         if(!order){
//             return res.status(404).json({ 
//                 message: 'Order not found' 
//             });
//         }

//         res.json(order);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: 'Server error' 
//         });
//     }
// };

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





//create order via staff
// const createOrderStaff = async(req, res) => {
//     try {
//         const {staffId} = req.body;
//         const token = req.cookies.token;
    
//         if(!token){
//             return res.status(400).json({
//             message: 'Unauthorized - Missing token',
//             });
//         }
  
//         jwt.verify(token, process.env.JWT_SECRET, {}, async(err, decodedToken) => {
//             if(err){
//                 return res.status(400).json({
//                     message: 'Unauthorized - Invalid token',
//                 });
//             }
    
//             const staffExists = await StaffAuthModel.findById(staffId);
//             if(!staffExists){
//                 return res.status(400).json({
//                     message: 'Staff does not exist',
//                 });
//             }
    
//             //fetch all items in the staff's cart
//             const cartItems = await StaffCartModel.find({
//                 staffId,
//             }).populate('productId');
    
//             if(cartItems.length === 0){
//                 return res.status(400).json({
//                     message: 'No items in the cart',
//                 });
//             }
    
//             //calculate total amount for the order
//             const totalAmount = cartItems.reduce((acc, item) => {
//                 return acc + item.productId.price * item.quantity;
//             }, 0);
    
//             //create the order for the staff
//             const order = new StaffOrderWalkinModel({
//                 staffId,
//                 items: cartItems.map((item) => ({
//                     productId: item.productId._id,
//                     productCode: item.productId.productCode,
//                     productName: item.productId.productName,
//                     category: item.productId.category,
//                     price: item.productId.price,
//                     quantity: item.quantity,
//                     uploaderId: item.productId.uploaderId,
//                     uploaderType: item.productId.uploaderType,
//                     imageUrl: item.productId.imageUrl,
//                     sizeUnit: item.productId.sizeUnit,
//                     productSize: item.productId.productSize,
//                     createdProductBy: item.productId.createdBy,
//                     createdProductAt: item.productId.createdAt,
//                     updatedProductBy: item.productId.updatedBy,
//                     updatedProductAt: item.productId.updatedAt,
//                 })),
//                 totalAmount,
//             });
    
//             await order.save();
    
//             await StaffCartModel.deleteMany({
//                 staffId,
//             });
    
//             res.status(201).json({
//                 message: 'Order created successfully',
//                 success: true,
//                 orderId: order._id,
//             });
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             message: 'Server error',
//         });
//     }
// };


//   const getPosOrdersStaff = async(req, res) => {
//     try {
//         const {staffId, orderId} = req.params;

//         //check if the staff exists
//         const staffExists = await StaffAuthModel.findById(staffId);
//         if(!staffExists){
//             return res.status(400).json({
//                 message: 'Staff does not exist',
//             });
//         }

//         //idf orderId is provided, fetch the specific order
//         if(orderId){
//             const order = await StaffOrderWalkinModel.findOne({_id: orderId, staffId});
//             if(!order){
//                 return res.status(404).json({ 
//                     message: 'Order not found' 
//                 });
//             }

//             return res.status(200).json({
//                 message: 'Order fetched successfully',
//                 order,
//             });
//         }

//         //otherwise, fetch all orders for the staff
//         const orders = await StaffOrderWalkinModel.find({staffId}).sort({createdAt: -1});

//         res.status(200).json({
//             message: 'Orders fetched successfully',
//             orders,
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             message: 'Server error',
//         });
//     }
// };


//   const getPosOrdersStaff = async (req, res) => {
//     try {
//         const {staffId} = req.params;

//         //heck if the staff exists
//         const staffExists = await StaffAuthModel.findById(staffId);
//         if(!staffExists){
//             return res.status(400).json({
//                 message: "Staff does not exist",
//             });
//         }

//         //ftch all orders for the staff
//         const orders = await StaffOrderModel.find({ staffId }).sort({ createdAt: -1 }); // Sort by most recent

//         res.status(200).json({
//             message: "Orders fetched successfully",
//             orders,
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             message: "Server error",
//         });
//     }
// };
  
module.exports = {
    getAllOrdersStaff,
    getOrderDetailsStaff,
    approveOrderStaff,
    updateOrderStatusStaff,
    getCompleteOrderTransactionStaff,
    // createOrderStaff,
    // getPosOrdersStaff
}