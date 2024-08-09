const StaffAuthModel = require("../../models/StaffModels/StaffAuthModel");
const OrderWalkinModel = require("../../models/StaffModels/StaffOrderWalkinModel");
const jwt = require('jsonwebtoken')

const addOrderWalkinStaff = (req, res) => {
    try {
        const {productName, category, price, quantity} = req.body;

        if(!productName || !category || !price || !quantity){
            return res.json({
                error: 'Please provide all required fields'
            });
        }

        const token = req.cookies.token;
        if(!token){
            return res.json({
                error: 'Unauthorized - Missing token'
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, {}, async(err, decodedToken) => {
            if(err){
                return res.json({
                    error: 'Unauthorized - Invalid token'
                });
            }

            const staffId = decodedToken.id;
            const staffExists = await StaffAuthModel.findById(staffId);
            if(!staffExists){
                return res.json({
                    error: 'Staff does not exist'
                });
            }

            const generateProductCode = () => {
                const code1 = Math.floor(Math.random() * 10).toString();
                const code2 = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
                const code3 = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
                return `${code1} ${code2} ${code3}`;
            };

            const newOrdersWalkin = await OrderWalkinModel.create({
                productCode: generateProductCode(),
                productName,
                category,
                price,
                quantity
            });

            return res.json({
                message: 'Order added successfully!',
                newOrdersWalkin
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error'
        });
    }
}


const getOrderWalkinStaff = async(req, res) => {
    try {
        const staffProducts = await OrderWalkinModel.find();
        return res.json(staffProducts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}


const updateOrderWalkinStaff = async(req, res) => {
    try {
        const {orderId} = req.params;
        const {productCode, productName, category, price, quantity} = req.body;

        if(!productCode || !productName || !category || !price || !quantity){
            return res.json({
                error: 'Please provide all required fields'
            });
        }

        const order = await OrderWalkinModel.findById(orderId);
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


const getUpdateOrderWalkinStaff = async(req, res) => {
    const {orderId} = req.params;
    try {
        const order = await OrderWalkinModel.findById(orderId);
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
    addOrderWalkinStaff,
    getOrderWalkinStaff,
    updateOrderWalkinStaff,
    getUpdateOrderWalkinStaff
}