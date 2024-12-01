const StaffAuthModel = require("../../models/StaffModels/StaffAuthModel");
const jwt = require('jsonwebtoken');
const StaffCartModel = require("../../models/StaffModels/StaffCartModel");
const ProductModel = require("../../models/ProductModel");
const { BestSellingModel, TotalSaleModel } = require("../../models/SalesOverviewModel");
const ProductionReportModel = require("../../models/ProductionReportModel");
const { getInventoryReport, getSalesReport } = require("../AdminControllers/AdminReportController");
const StaffOrderRefillModel = require("../../models/StaffModels/StaffOrderRefillModel");

//create order via staff
const addOrderRefillStaff = async(req, res) => {
    try {
        const {staffId} = req.body;
        const token = req.cookies.token;
    
        if(!token){
            return res.status(400).json({
            message: 'Unauthorized - Missing token',
            });
        }
  
        jwt.verify(token, process.env.JWT_SECRET, {}, async(err, decodedToken) => {
            if(err){
                return res.status(400).json({
                    message: 'Unauthorized - Invalid token',
                });
            }
    
            const staffExists = await StaffAuthModel.findById(staffId);
            if(!staffExists){
                return res.status(400).json({
                    message: 'Staff does not exist',
                });
            }
    
            //fetch all items in the staff's cart
            const cartItems = await StaffCartModel.find({
                staffId,
            }).populate('productId');
    
            if(cartItems.length === 0){
                return res.status(400).json({
                    message: 'No items in the cart',
                });
            }
    
            //calculate total amount for the order
            // const totalAmount = cartItems.reduce((acc, item) => {
            //     return acc + item.productId.price * item.quantity;
            // }, 0);
            //calculate raw total amount
            const rawTotalAmount = cartItems.reduce((acc, item) => {
                return acc + item.productId.price * item.quantity;
            }, 0);

            //apply discount logic
            let discountRate = 0;

            if(rawTotalAmount >= 2000 && rawTotalAmount < 10000){
                discountRate = 0.05; //5% discount
            } else if(rawTotalAmount >= 10000){
                discountRate = 0.10; //10% discount
            }

            const discountAmount = rawTotalAmount * discountRate;
            const totalAmount = rawTotalAmount - discountAmount; //final discounted total
    
            //create the order for the staff
            const order = new StaffOrderRefillModel({
                staffId,
                items: cartItems.map((item) => ({
                    productId: item.productId._id,
                    productCode: item.productId.productCode,
                    productName: item.productId.productName,
                    category: item.productId.category,
                    price: item.productId.price,
                    quantity: item.quantity,
                    uploaderId: item.productId.uploaderId,
                    uploaderType: item.productId.uploaderType,
                    imageUrl: item.productId.imageUrl,
                    sizeUnit: item.productId.sizeUnit,
                    productSize: item.productId.productSize,
                    createdProductBy: item.productId.createdBy,
                    createdProductAt: item.productId.createdAt,
                    updatedProductBy: item.productId.updatedBy,
                    updatedProductAt: item.productId.updatedAt,
                })),
                totalAmount,
            });
    
            await order.save();
            
            //update product quantities based on the order
            await Promise.all(cartItems.map(async (item) => {
                await ProductModel.findByIdAndUpdate(item.productId._id, {
                    $inc: {quantity: -item.quantity} //decrease product quantity
                });

                const today = new Date();
                today.setUTCHours(0, 0, 0, 0); //set time to midnight for the day field

                //production report
                const existingProductionReport = await ProductionReportModel.findOne({
                    productId: item.productId._id,
                    date: today,
                });

                if(existingProductionReport){
                    await ProductionReportModel.updateOne(
                        {_id: existingProductionReport._id},
                        {$inc: { productionQuantity: item.quantity}}
                    );
                } else {
                    await ProductionReportModel.create({
                        productId: item.productId._id,
                        productName: item.productId.productName,
                        productionQuantity: item.quantity,
                        date: today,
                    });
                }


                //total sales
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
    
            await StaffCartModel.deleteMany({
                staffId,
            });
    
            res.status(201).json({
                message: 'Order created successfully',
                success: true,
                orderId: order._id,
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error',
        });
    }
};


const getOrderRefillStaff = async(req, res) => {
    try {
        const {staffId, orderId} = req.params;

        //check if the staff exists
        const staffExists = await StaffAuthModel.findById(staffId);
        if(!staffExists){
            return res.status(400).json({
                message: 'Staff does not exist',
            });
        }

        //idf orderId is provided, fetch the specific order
        if(orderId){
            const order = await StaffOrderRefillModel.findOne({_id: orderId, staffId});
            if(!order){
                return res.status(404).json({ 
                    message: 'Order not found' 
                });
            }

            return res.status(200).json({
                message: 'Order fetched successfully',
                order,
            });
        }

        //otherwise, fetch all orders for the staff
        const orders = await StaffOrderRefillModel.find({staffId}).sort({createdAt: -1});

        res.status(200).json({
            message: 'Orders fetched successfully',
            orders,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error',
        });
    }
};

const getAllOrderRefillStaff = async(req, res) => {
    try {
        const staffProducts = await StaffOrderRefillModel.find();
        return res.json(staffProducts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}

const updateOrderRefillStaff = async(req, res) => {
    try {
        const {orderId} = req.params;
        const {productCode, productName, category, price, quantity} = req.body;

        if(!productCode || !productName || !category || !price || !quantity){
            return res.json({
                error: 'Please provide all required fields'
            });
        }

        const order = await StaffOrderRefillModel.findById(orderId);
        if(!order){
            return res.json({
                error: 'Product not found'
            });
        }

        //eemove ownership check
        order.productCode = productCode;
        order.productName = productName;
        order.category = category;
        order.price = price;
        order.quantity = quantity;

        const updatedOrderWaklin = await order.save();

        return res.json({
            message: 'Order updated successfully!',
            updatedOrderWaklin
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}


const getUpdateOrderRefillStaff = async(req, res) => {
    const {orderId} = req.params;
    try {
        const order = await StaffOrderRefillModel.findById(orderId);
        if(!order){
            return res.status(404).json({ 
                message: 'Order not found'
            });
        }
        res.json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}


module.exports = {
    addOrderRefillStaff,
    getOrderRefillStaff,
    getAllOrderRefillStaff,
    updateOrderRefillStaff,
    getUpdateOrderRefillStaff
}