const OrderModel = require("../../models/OrderModel");



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
            approved: true 
        }, {new: true});

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
};


const updateOrderStatusStaff = async(req, res) => {
    try {
        const {orderId} = req.params;
        const {status} = req.body; //status will be one of 'shipped', 'outForDelivery', 'delivered'

        //validate status
        if(!['shipped', 'outForDelivery', 'delivered'].includes(status)){
            return res.status(400).json({ 
                message: 'Invalid status' 
            });
        }

        const updateFields = {
            shipped: status === 'shipped' ? true : false,
            outForDelivery: status === 'outForDelivery' ? true : false,
            delivered: status === 'delivered' ? true : false,
        };

        const order = await OrderModel.findByIdAndUpdate(orderId, updateFields, { new: true });

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
};

module.exports = {
    getAllOrdersStaff,
    getOrderDetailsStaff,
    approveOrderStaff,
    updateOrderStatusStaff
}