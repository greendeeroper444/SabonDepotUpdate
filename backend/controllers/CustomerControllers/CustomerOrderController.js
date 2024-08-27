const CartModel = require("../../models/CartModel");
const CustomerAuthModel = require("../../models/CustomerModels/CustomerAuthModel");
const OrderModel = require("../../models/OrderModel");


const createOrderCustomer = async(req, res) => {
    try {
        const {customerId, paymentMethod, selectedItems, billingDetails, partialPayment = 0} = req.body;

        //fetch selected cart items for the customer
        const cartItems = await CartModel.find({
            _id: { $in: selectedItems },
            customerId,
        }).populate('productId');

        if(cartItems.length === 0){
            return res.status(400).json({
                message: 'No items selected from the cart',
            });
        }

        //check if the customer is new
        const customerExists = await CustomerAuthModel.findById(customerId);
        const currentTime = Date.now();
        const isNewCustomer = customerExists.isNewCustomer && currentTime <= customerExists.newCustomerExpiresAt;

        //calculate total amount
        const totalAmount = cartItems.reduce((acc, item) => {
            const originalPrice = item.productId.price;
            let discountedPrice = originalPrice;

            //calculate discounted price
            if(item.productId.discountPercentage && item.productId.discountPercentage > 0){
                discountedPrice = originalPrice - (originalPrice * item.productId.discountPercentage / 100);
            }

            //determine final price based on new customer status
            let finalPrice = discountedPrice;
            if(isNewCustomer){
                finalPrice = discountedPrice;
            } else{
                finalPrice = originalPrice;
            }

            item.finalPrice = finalPrice; //set the finalPrice for the item
            return acc + finalPrice * item.quantity;
        }, 0);

        const shippingCost = 50;
        const totalAmountWithShipping = totalAmount + shippingCost;

        //calculate outstanding amount and payment status
        const outstandingAmount = totalAmountWithShipping - partialPayment;
        const paymentStatus = outstandingAmount > 0 ? 'Partial' : 'Paid';

        //create the order
        const order = new OrderModel({
            customerId,
            items: cartItems.map(item => ({
                productId: item.productId._id,
                productCode: item.productId.productCode,
                productName: item.productId.productName,
                category: item.productId.category,
                price: item.productId.price,
                discountPercentage: item.productId.discountPercentage,
                discountedPrice: item.discountedPrice,
                finalPrice: item.finalPrice,
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
            partialPayment,
            outstandingAmount,
            paymentMethod,
            billingDetails,
            paymentStatus,
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

// const createOrderCustomer = async(req, res) => {
//     try {
//         const {customerId, paymentMethod, selectedItems, billingDetails, partialPayment = 0} = req.body;

//         //fetch selected cart items for the customer
//         const cartItems = await CartModel.find({
//             _id: {$in: selectedItems},
//             customerId,
//         }).populate('productId');

//         if(cartItems.length === 0){
//             return res.status(400).json({
//                 message: 'No items selected from the cart',
//             });
//         }

//         //calculate total amount
//         // const totalAmount = cartItems.reduce(
//         //     (acc, item) => acc + item.productId.price * item.quantity,
//         //     0
//         // );

//         // const totalAmount = cartItems.reduce(
//         //     (acc, item) => {
//         //         const price = item.discountedPrice !== undefined ? item.discountedPrice : item.productId.price;
//         //         return acc + price * item.quantity;
//         //     },
//         //     0
//         // );
//         const totalAmount = cartItems.reduce(
//             (acc, item) => {
//                 const price = item.discountedPrice !== undefined ? item.discountedPrice : item.productId.price;
//                 return acc + price * item.quantity;
//             },
//             0
//         );

//         const shippingCost = 50;
//         const totalAmountWithShipping = totalAmount + shippingCost;

//         //calculate outstanding amount and payment status
//         const outstandingAmount = totalAmountWithShipping - partialPayment;
//         const paymentStatus = outstandingAmount > 0 ? 'Partial' : 'Paid';


//         const order = new OrderModel({
//             customerId,
//             items: cartItems.map(item => ({
//                 productId: item.productId._id,
//                 productCode: item.productId.productCode,
//                 productName: item.productId.productName,
//                 category: item.productId.category,
//                 price: item.productId.price,
//                 discountPercentage: item.productId.discountPercentage,
//                 discountedPrice: item.productId.discountedPrice,
//                 quantity: item.quantity,
//                 uploaderId: item.productId.uploaderId,
//                 uploaderType: item.productId.uploaderType,
//                 imageUrl: item.productId.imageUrl,
//                 createdProductBy: item.productId.createdBy,
//                 createdProductAt: item.productId.createdAt,
//                 updatedProductBy: item.productId.updatedBy,
//                 updatedProductAt: item.productId.updatedAt,
//             })),
//             totalAmount: totalAmountWithShipping,
//             partialPayment,
//             outstandingAmount,
//             paymentMethod,
//             billingDetails,
//             paymentStatus, 
//             orderStatus: 'On Delivery',
//         });

//         await order.save();

//         //remove selected items from the cart
//         await CartModel.deleteMany({
//             _id: {$in: selectedItems},
//             customerId,
//         });

//         res.status(201).json({
//             message: 'Order created successfully',
//             orderId: order._id,
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ 
//             message: 'Server error' 
//         });
//     }
// };



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