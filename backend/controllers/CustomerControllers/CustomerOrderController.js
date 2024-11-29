const CartModel = require("../../models/CartModel");
const CustomerAuthModel = require("../../models/CustomerModels/CustomerAuthModel");
const OrderModel = require("../../models/OrderModel");
const path = require('path');
const multer = require('multer');
const ProductModel = require("../../models/ProductModel");
const { BestSellingModel, TotalSaleModel } = require("../../models/SalesOverviewModel");
const { getInventoryReport, getSalesReport } = require("../AdminControllers/AdminReportController");
const mongoose = require('mongoose');
const NotificationStaffModel = require("../../models/StaffModels/NotificationStaffModel");
const NotificationModel = require("../../models/NotificationModel");

//set up storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/paymentProofs');
    },
    filename: function(req, file, cb){
        const uniqueSuffix = '-' + Date.now() + path.extname(file.originalname);
        cb(null, file.originalname.replace(path.extname(file.originalname), '') + uniqueSuffix);
    }
});

//initialize upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('paymentProof');

//check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

const handleGcashPayment = async({paymentProof, gcashPaid, totalAmountWithShipping, partialPayment}) => {
    if(!paymentProof){
        throw new Error('Payment proof is required for Gcash payment.');
    }

    const outstandingAmount = totalAmountWithShipping - gcashPaid;
    const paymentStatus = outstandingAmount > 0 ? 'Partial' : 'Paid';

    return {paymentStatus, outstandingAmount};
};

const handleCodPayment = async({paymentProof, totalAmountWithShipping, partialPayment}) => {
    if(!paymentProof){
        throw new Error('Payment proof is required for COD payment.');
    }

    const outstandingAmount = totalAmountWithShipping - partialPayment;
    const paymentStatus = 'Partial';

    return {paymentStatus, outstandingAmount};
};

// const handlePayLaterPayment = async({totalAmountWithShipping}) => {
//     const outstandingAmount = totalAmountWithShipping; 
//     const paymentStatus = 'Unpaid';

//     return { paymentStatus, outstandingAmount };
// };

const createOrderCustomer = async(req, res) => {
    upload(req, res, async (err) => {
        if(err){
            return res.status(400).json({
                message: err
            });
        }

        try {
            const {
                customerId,
                paymentMethod,
                selectedItems,
                billingDetails,
                partialPayment = 0,
                gcashPaid = 0,
                referenceNumber
            } = req.body;
            const paymentProof = req.file ? req.file.path : '';

            let parsedBillingDetails = {};

            try {
                parsedBillingDetails = JSON.parse(billingDetails);
            } catch (error) {
                return res.status(400).json({
                    message: 'Invalid billing details format.'
                });
            }

            //validate billing details
            if(
                !parsedBillingDetails.firstName ||
                !parsedBillingDetails.lastName ||
                !parsedBillingDetails.middleInitial ||
                !parsedBillingDetails.contactNumber ||
                !parsedBillingDetails.province ||
                !parsedBillingDetails.city ||
                !parsedBillingDetails.barangay ||
                !parsedBillingDetails.purokStreetSubdivision ||
                !parsedBillingDetails.emailAddress ||
                !parsedBillingDetails.clientType
            ){
                return res.status(400).json({
                    message: 'Billing details are required.'
                });
            }

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

            // Handle payment based on method
            let paymentStatus, outstandingAmount;

            if(paymentMethod === 'Gcash'){
                ({paymentStatus, outstandingAmount} = await handleGcashPayment({
                    paymentProof,
                    gcashPaid,
                    referenceNumber,
                    totalAmountWithShipping,
                    partialPayment
                }));
            } else if(paymentMethod === 'Cash On Delivery'){
                ({paymentStatus, outstandingAmount} = await handleCodPayment({
                    paymentProof,
                    referenceNumber,
                    totalAmountWithShipping,
                    partialPayment
                }));
            }
            
            // else{
            //     console.log('Received Payment Method:', paymentMethod);
            //     return res.status(400).json({
            //         message: 'Invalid payment method'
            //     });
            // }

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
                    sizeUnit:  item.productId.sizeUnit,
                    productSize: item.productId.productSize,
                    createdProductBy: item.productId.createdBy,
                    createdProductAt: item.productId.createdAt,
                    updatedProductBy: item.productId.updatedBy,
                    updatedProductAt: item.productId.updatedAt,
                })),
                totalAmount: totalAmountWithShipping,
                paymentProof,
                gcashPaid,
                referenceNumber,
                partialPayment,
                outstandingAmount,
                paymentMethod,
                billingDetails: parsedBillingDetails,
                paymentStatus,
                orderStatus: 'Pending',
            });

            await order.save();

            //update product quantities based on the order
            await Promise.all(cartItems.map(async (item) => {
                await ProductModel.findByIdAndUpdate(item.productId._id, {
                    $inc: {quantity: -item.quantity} //decrease product quantity
                });

                const today = new Date();
                today.setUTCHours(0, 0, 0, 0); //set time to midnight for the day field
                const existingRecord = await TotalSaleModel.findOne({
                    productName: item.productId.productName,
                    day: today,
                });

                if(existingRecord){
                    //update existing record
                    await TotalSaleModel.updateOne(
                        {_id: existingRecord._id},
                        {
                            $inc: {
                                totalProduct: 1,
                                totalSales: item.productId.price * item.quantity,
                                quantitySold: item.quantity,
                            },
                        }
                    );
                } else{
                    //create a new record
                    await TotalSaleModel.create({
                        productName: item.productId.productName,
                        totalProduct: 1,
                        totalSales: item.productId.price * item.quantity,
                        quantitySold: item.quantity,
                        day: today,
                    });
                }

                //get all best selling
                //update bestSellingRecord model
                const bestSellingRecord = await BestSellingModel.findOne({productId: item.productId._id});
                if(bestSellingRecord){
                    //update existing record
                    bestSellingRecord.totalProduct += 1;
                    bestSellingRecord.totalSales += item.finalPrice * item.quantity;
                    bestSellingRecord.quantitySold += item.quantity;
                    bestSellingRecord.lastSoldAt = Date.now();
                    await bestSellingRecord.save();
                } else{
                    //create a new record
                    await BestSellingModel.create({
                        productId: item.productId._id,
                        productName: item.productId.productName,
                        totalSales: item.finalPrice * item.quantity,
                        quantitySold: item.quantity,
                        sizeUnit: item.productId.sizeUnit,
                        productSize: item.productId.productSize,
                        lastSoldAt: Date.now(),
                    });
                }


                await getInventoryReport(
                    item.productId._id,
                    item.productId.productName,
                    item.productId.sizeUnit,
                    item.productId.productSize,
                    item.productId.category,
                    item.quantity,
                    true
                );

                await getSalesReport(
                    item.productId._id,
                    item.productId.productName,
                    item.productId.sizeUnit,
                    item.productId.productSize,
                    item.productId.category,
                    item.quantity,
                    true
                );

            }));


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
    });
};


// const createOrderCustomer = async(req, res) => {
//      upload(req, res, async(err) => {
//         if(err){
//             return res.status(400).json({
//                 message: err
//             });
//         }

//         try {
//             const {
//                 customerId, 
//                 paymentMethod, 
//                 selectedItems, 
//                 billingDetails, 
//                 partialPayment = 0, 
//                 gcashPaid = 0
//             } = req.body;
//             const paymentProof = req.file ? req.file.path : null;

//             let parsedBillingDetails = {};

//             try {
//                 parsedBillingDetails = JSON.parse(billingDetails);
//             } catch (error) {
//                 return res.status(400).json({ 
//                     message: 'Invalid billing details format.'
//                 });
//             }
            
//             //validate billingDetails
//             if(
//                 !parsedBillingDetails.fullName || 
//                 !parsedBillingDetails.emailAddress || 
//                 !parsedBillingDetails.contactNumber || 
//                 !parsedBillingDetails.city || 
//                 !parsedBillingDetails.address
//             ){
//                 return res.status(400).json({ 
//                     message: 'Billing details are required.' 
//                 });
//             }

//             if(paymentMethod === 'Gcash' && !paymentProof){
//                 return res.status(400).json({ 
//                     message: 'Payment proof is required for Gcash payment.' 
//                 });
//             }
            

//             //fetch selected cart items for the customer
//             const cartItems = await CartModel.find({
//                 _id: {$in: selectedItems},
//                 customerId,
//             }).populate('productId');

//             if(cartItems.length === 0){
//                 return res.status(400).json({
//                     message: 'No items selected from the cart',
//                 });
//             }

//             //check if the customer is new
//             const customerExists = await CustomerAuthModel.findById(customerId);
//             const currentTime = Date.now();
//             const isNewCustomer = customerExists.isNewCustomer && currentTime <= customerExists.newCustomerExpiresAt;

//             //calculate total amount
//             const totalAmount = cartItems.reduce((acc, item) => {
//                 const originalPrice = item.productId.price;
//                 let discountedPrice = originalPrice;

//                 //calculate discounted price
//                 if(item.productId.discountPercentage && item.productId.discountPercentage > 0){
//                     discountedPrice = originalPrice - (originalPrice * item.productId.discountPercentage / 100);
//                 }

//                 //determine final price based on new customer status
//                 let finalPrice = discountedPrice;
//                 if(isNewCustomer){
//                     finalPrice = discountedPrice;
//                 } else{
//                     finalPrice = originalPrice;
//                 }

//                 item.finalPrice = finalPrice; //set the finalPrice for the item
//                 return acc + finalPrice * item.quantity;
//             }, 0);

//             const shippingCost = 50;
//             const totalAmountWithShipping = totalAmount + shippingCost;

//             //calculate outstanding amount and payment status
//             const outstandingAmount = totalAmountWithShipping - partialPayment;
//             const paymentStatus = outstandingAmount > 0 ? 'Partial' : 'Paid';

//             //create the order
//             const order = new OrderModel({
//                 customerId,
//                 items: cartItems.map(item => ({
//                     productId: item.productId._id,
//                     productCode: item.productId.productCode,
//                     productName: item.productId.productName,
//                     category: item.productId.category,
//                     price: item.productId.price,
//                     discountPercentage: item.productId.discountPercentage,
//                     discountedPrice: item.discountedPrice,
//                     finalPrice: item.finalPrice,
//                     quantity: item.quantity,
//                     uploaderId: item.productId.uploaderId,
//                     uploaderType: item.productId.uploaderType,
//                     imageUrl: item.productId.imageUrl,
//                     createdProductBy: item.productId.createdBy,
//                     createdProductAt: item.productId.createdAt,
//                     updatedProductBy: item.productId.updatedBy,
//                     updatedProductAt: item.productId.updatedAt,
//                 })),
//                 totalAmount: totalAmountWithShipping,
//                 paymentProof: paymentMethod === 'Gcash' ? paymentProof : null,
//                 gcashPaid,
//                 partialPayment,
//                 outstandingAmount,
//                 paymentMethod,
//                 billingDetails: parsedBillingDetails,
//                 paymentStatus,
//                 orderStatus: 'On Delivery',
//             });

//             await order.save();

//             //remove selected items from the cart
//             await CartModel.deleteMany({
//                 _id: {$in: selectedItems},
//                 customerId,
//             });

//             res.status(201).json({
//                 message: 'Order created successfully',
//                 orderId: order._id,
//             });
//         } catch (error) {
//             console.error(error);
//             return res.status(500).json({
//                 message: 'Server error'
//             });
//         }
//    });
// };

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
    const {customerId} = req.params;

    try {
        const orders = await OrderModel.find({customerId}).populate('items.productId');
        res.status(200).json({orders});
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error'
        });
    }
}

const uploadProof = async(req, res) => {
    try {
        //wrapping multer's upload logic in a Promise
        await new Promise((resolve, reject) => {
            upload(req, res, (err) => {
                if(err){
                    reject(err);
                } else{
                    resolve();
                }
            });
        });

        const {orderId} = req.params;

        //validate orderId
        if(!mongoose.Types.ObjectId.isValid(orderId)){
            return res.status(400).json({ 
                error: 'Invalid orderId format' 
            });
        }

        const order = await OrderModel.findById(orderId);
        if(!order){
            return res.status(404).json({ 
                error: 'Order not found' 
            });
        }

        const paymentProof = req.file ? req.file.path : '';
        order.paymentProof = paymentProof;

        const updatedOrder = await order.save();

        //create notification
         const notification = new NotificationModel({
            customerId: order.customerId,
            orderId: order._id,
            message: `Payment proof uploaded for Order #${orderId}.`,
        });
        await notification.save();

        res.json({
            message: 'Payment proof uploaded successfully!',
            updatedOrder,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Server error', 
            error 
        });
    }
};

const receivedButton = async(req, res) => {
    const {orderId} = req.params;

    try {
        //find and update the order's `isReceived` field
        const order = await OrderModel.findByIdAndUpdate(
            orderId,
            {isReceived: true, receivedDate: Date.now()},
            {new: true}
        );

        if(!order){
            return res.status(404).json({ 
                message: 'Order not found' 
            });
        }

        //create a notification
        const {customerId, billingDetails} = order;
        const notification = new NotificationStaffModel({
            customerId: customerId,
            orderId: orderId,
            message: `${billingDetails.firstName} ${billingDetails.middleInitial} ${billingDetails.lastName} received the order #${orderId}.`,
        });
        await notification.save();

        res.status(200).json({ 
            message: 'Order received successfully', 
            order 
        });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ 
            message: 'Error updating order', error 
        });
    }
};


module.exports = {
    createOrderCustomer,
    getOrderCustomer,
    getAllOrdersCustomer,
    uploadProof,
    receivedButton
}