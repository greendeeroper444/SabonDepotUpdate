const CartModel = require("../../models/CartModel");
const OrderModel = require("../../models/OrderModel");

const createOrderCustomer = async(req, res) => {
    try {
        const {customerId, paymentMethod, selectedItems, billingDetails} = req.body;

        //fetch selected cart items for the customer
        const cartItems = await CartModel.find({
            _id: {$in: selectedItems},
            customerId,
        }).populate('productId');

        if(cartItems.length === 0){
            return res.status(400).json({
                message: 'No items selected from the cart',
            });
        }

        //calculate total amount
        // const totalAmount = cartItems.reduce(
        //     (acc, item) => acc + item.productId.price * item.quantity,
        //     0
        // );

        const totalAmount = cartItems.reduce(
            (acc, item) => {
                const price = item.discountedPrice !== undefined ? item.discountedPrice : item.productId.price;
                return acc + price * item.quantity;
            },
            0
        );

        const shippingCost = 50;
        const totalAmountWithShipping = totalAmount + shippingCost;

        const order = new OrderModel({
            customerId,
            items: cartItems.map(item => ({
                productId: item.productId._id,
                productCode: item.productId.productCode,
                productName: item.productId.productName,
                category: item.productId.category,
                price: item.productId.price,
                discountPercentage: item.productId.discountPercentage,
                discountedPrice: item.productId.discountedPrice,
                quantity: item.quantity,
                uploaderId: item.productId.uploaderId,
                uploaderType: item.productId.uploaderType,
                imageUrl: item.productId.imageUrl,
                createdProductBy: item.productId.createdBy,
                createdProductAt: item.productId.createdAt,
                updatedProductBy: item.productId.updatedBy,
                updatedProductAt: item.productId.updatedAt,
            })),
            totalAmount: totalAmountWithShipping,
            paymentMethod,
            billingDetails,
            paymentStatus: 'Pending', 
            orderStatus: 'On Delivery',
        });

        await order.save();

        //remove selected items from the cart
        await CartModel.deleteMany({
            _id: {$in: selectedItems},
            customerId,
        });

        res.status(201).json({
            message: 'Order created successfully',
            orderId: order._id,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};



const getOrderCustomer = async(req, res) => {
    const {customerId, orderId} = req.params;

    try {
        const order = await OrderModel.findOne({ 
            _id: orderId, 
            customerId 
        }).populate('items.productId');

        if(!order){
            return res.status(404).json({ 
                message: 'Order not found' 
            });
        }
        res.status(200).json({order});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}



const getAllOrdersCustomer = async(req, res) => {
    const { customerId } = req.params;

    try {
        const orders = await OrderModel.find({ customerId }).populate('items.productId');
        res.status(200).json({ orders });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error'
        });
    }
}

module.exports = {
    createOrderCustomer,
    getOrderCustomer,
    getAllOrdersCustomer
}