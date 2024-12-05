const CartModel = require('../../models/CartModel');
const jwt = require('jsonwebtoken');
const CustomerAuthModel = require('../../models/CustomerModels/CustomerAuthModel');
const ProductModel = require('../../models/ProductModel');


const addProductToCartCustomer = async(req, res) => {
    const {productId, quantity} = req.body;
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

        const customerId = decodedToken.id;

        const customerExists = await CustomerAuthModel.findById(customerId);
        if(!customerExists){
            return res.json({
                error: 'Customer does not exist'
            });
        }

        try {
            const product = await ProductModel.findById(productId);

            if(!product){
                return res.json({
                    error: 'Product does not exist'
                });
            }

            const originalPrice = product.price;
            let discountedPrice = originalPrice;

            //calculate discounted price
            if(product.discountPercentage && product.discountPercentage > 0){
                discountedPrice = originalPrice - (originalPrice * product.discountPercentage / 100);
            }

            //determine final price based on new customer status
            const currentTime = Date.now();
            let finalPrice = discountedPrice;
            // if(customerExists.isNewCustomer && currentTime <= customerExists.newCustomerExpiresAt){
            //     finalPrice = discountedPrice;
            // } else{
            //     finalPrice = originalPrice;
            // }
            if(customerExists.isNewCustomer){
                finalPrice = discountedPrice;
            } else{
                finalPrice = originalPrice;
            }
            let existingCartItem = await CartModel.findOne({customerId, productId});

            if(existingCartItem){
                //if item exists, update the quantity and finalPrice
                existingCartItem.quantity += quantity;
                existingCartItem.discountedPrice = discountedPrice;
                existingCartItem.finalPrice = finalPrice;
                existingCartItem.updatedAt = Date.now();
                await existingCartItem.save();
            } else{
                await new CartModel({
                    customerId,
                    productId,
                    quantity,
                    discountedPrice,
                    finalPrice
                }).save();
            }

            const updatedCart = await CartModel.find({
                customerId
            }).populate('productId');

            res.json(updatedCart);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Server error'
            });
        }
    });
};

// const addProductToCartCustomer = async(req, res) => {
//     const {productId, quantity} = req.body; 
//     const token = req.cookies.token;

//     if(!token){
//         return res.json({ 
//             error: 'Unauthorized - Missing token' 
//         });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, {}, async(err, decodedToken) => {
//         if(err){
//             return res.json({ 
//                 error: 'Unauthorized - Invalid token' 
//             });
//         }

//         const customerId = decodedToken.id;

//         const customerExists = await CustomerAuthModel.findById(customerId);
//         if(!customerExists){
//             return res.json({ 
//                 error: 'Customer does not exist' 
//             });
//         }

//         try {
//             const product = await ProductModel.findById(productId);

//             if(!product){
//                 return res.json({ 
//                     error: 'Product does not exist' 
//                 });
//             }

//             const originalPrice = product.price;
//             let discountedPrice = originalPrice;

//             //calculate discounted price
//             if(product.discountPercentage && product.discountPercentage > 0){
//                 discountedPrice = originalPrice - (originalPrice * product.discountPercentage / 100);
//             }

//             let existingCartItem = await CartModel.findOne({customerId, productId});

//             if(existingCartItem){
//                 //if item exists, update the quantity
//                 existingCartItem.quantity += quantity;
//                 existingCartItem.discountedPrice = discountedPrice;
//                 existingCartItem.updatedAt = Date.now();
//                 await existingCartItem.save();
//             } else{
//                 await new CartModel({ 
//                     customerId, 
//                     productId, 
//                     quantity,
//                     discountedPrice
//                 }).save();
//             }

//             const updatedCart = await CartModel.find({ 
//                 customerId 
//             }).populate('productId');

//             res.json(updatedCart);
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({ 
//                 message: 'Server error' 
//             });
//         }
//     });
// };


const getProductCartCustomer = async(req, res) => {
    const customerId = req.params.customerId;
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

        if(decodedToken.id !== customerId){
            return res.json({ 
                error: 'Unauthorized - Invalid customer ID'
            });
        }

        try {
            //fetch cart items for the customer
            const cartItems = await CartModel.find({customerId}).populate('productId');
            res.json(cartItems);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ 
                message: 'Server error' 
            });
        }
    });
};


const removeProductFromCartCustomer = async(req, res) => {
    const {cartItemId} = req.params;
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

        try {
            await CartModel.findByIdAndDelete(cartItemId);
            res.json({ 
                success: true,
                message: 'Product removed from cart' 
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ 
                message: 'Server error' 
            });
        }
    });
};


const updateProductQuantity = async(req, res) => {
    const {cartItemId} = req.params;
    const {quantity} = req.body;
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

        try {
            const cartItem = await CartModel.findById(cartItemId);
            if(!cartItem){
                return res.status(404).json({ 
                    error: 'Cart item not found' 
                });
            }

            cartItem.quantity = quantity;
            await cartItem.save();
            res.json({ 
                message: 'Quantity updated successfully', 
                cartItem 
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Server error' 
            });
        }
    });
};

module.exports = {
    addProductToCartCustomer,
    getProductCartCustomer,
    removeProductFromCartCustomer,
    updateProductQuantity
}








