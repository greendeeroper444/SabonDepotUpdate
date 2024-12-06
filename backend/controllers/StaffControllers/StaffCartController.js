const ProductModel = require("../../models/ProductModel");
const StaffAuthModel = require("../../models/StaffModels/StaffAuthModel");
const StaffCartModel = require("../../models/StaffModels/StaffCartModel");
const jwt = require('jsonwebtoken');
const WorkinProgressProductModel = require("../../models/WorkinProgressProductModel");


// const addProductToCartStaff = async(req, res) => {
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

//         const staffId = decodedToken.id;

//         const staffExists = await StaffAuthModel.findById(staffId);
//         if(!staffExists){
//             return res.json({
//                 error: 'Staff does not exist'
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

//             //determine final price based on new customer status
//             const currentTime = Date.now();
//             let finalPrice = discountedPrice;
//             if(staffExists.isNewCustomer && currentTime <= staffExists.newCustomerExpiresAt){
//                 finalPrice = discountedPrice;
//             } else{
//                 finalPrice = originalPrice;
//             }

//             let existingCartItem = await CartModel.findOne({staffId, productId});

//             if(existingCartItem){
//                 //if item exists, update the quantity and finalPrice
//                 existingCartItem.quantity += quantity;
//                 existingCartItem.discountedPrice = discountedPrice;
//                 existingCartItem.finalPrice = finalPrice;
//                 existingCartItem.updatedAt = Date.now();
//                 await existingCartItem.save();
//             } else{
//                 await new CartModel({
//                     staffId,
//                     productId,
//                     quantity,
//                     discountedPrice,
//                     finalPrice
//                 }).save();
//             }

//             const updatedCart = await StaffCartModel.find({
//                 staffId
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

// const addProductToCartStaff = async(req, res) => {
//     const {productId, quantity} = req.body;
//     const token = req.cookies.token;
  
//     if(!token){
//         return res.json({
//             error: 'Unauthorized - Missing token',
//         });
//     }
  
//     jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decodedToken) => {
//         if(err){
//             return res.json({
//             error: 'Unauthorized - Invalid token',
//             });
//         }

//         const staffId = decodedToken.id;

//         const staffExists = await StaffAuthModel.findById(staffId);
//         if(!staffExists){
//                 return res.json({
//                 error: 'Staff does not exist',
//             });
//         }

//         try {
//             const product = await ProductModel.findById(productId);

//             if(!product){
//                 return res.json({
//                     error: 'Product does not exist',
//                 });
//             }

//                 const finalPrice = product.price;

//                 let existingCartItem = await StaffCartModel.findOne({staffId, productId});

//                 if(existingCartItem){
//                 //if item exists, update the quantity and finalPrice
//                 existingCartItem.quantity += quantity;
//                 existingCartItem.finalPrice = finalPrice;
//                 existingCartItem.updatedAt = Date.now();
//                 await existingCartItem.save();
//             } else {
//                 await new StaffCartModel({
//                     staffId,
//                     productId,
//                     quantity,
//                     finalPrice,
//                 }).save();
//             }

//             const updatedCart = await StaffCartModel.find({
//                 staffId,
//             }).populate('productId');

//             res.json(updatedCart);
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({
//                 message: 'Server error',
//             });
//         }
//     });
// };
// const addProductToCartStaff = async(req, res) => {
//     const {productId, quantity} = req.body;
//     const token = req.cookies.token;

//     if(!token){
//         return res.json({
//             error: 'Unauthorized - Missing token',
//         });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, {}, async(err, decodedToken) => {
//         if(err){
//             return res.json({
//                 error: 'Unauthorized - Invalid token',
//             });
//         }

//         const staffId = decodedToken.id;

//         const staffExists = await StaffAuthModel.findById(staffId);
//         if(!staffExists){
//             return res.json({
//                 error: 'Staff does not exist',
//             });
//         }

//         try {
//             //try to find the product in both ProductModel and WorkinProgressProductModel
//             let product = await ProductModel.findById(productId);
//             if(!product){
//                 product = await WorkinProgressProductModel.findById(productId);
//             }

//             if(!product){
//                 return res.json({
//                     error: 'Product does not exist in both ProductModel and WorkinProgressProductModel',
//                 });
//             }

//             const finalPrice = product.price;

//             let existingCartItem = await StaffCartModel.findOne({staffId, productId});

//             if(existingCartItem){
//                 //if item exists, update the quantity and finalPrice
//                 existingCartItem.quantity += quantity;
//                 existingCartItem.finalPrice = finalPrice;
//                 existingCartItem.updatedAt = Date.now();
//                 await existingCartItem.save();
//             } else{
//                 await new StaffCartModel({
//                     staffId,
//                     productId,
//                     quantity,
//                     finalPrice,
//                 }).save();
//             }

//             const updatedCart = await StaffCartModel.find({
//                 staffId,
//             }).populate('productId');

//             res.json(updatedCart);
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({
//                 message: 'Server error',
//             });
//         }
//     });
// };
const addProductToCartStaff = async(req, res) => {
    const {productId, quantity} = req.body;
    const token = req.cookies.token;

    if(!token){
        return res.json({
            error: 'Unauthorized - Missing token',
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, {}, async(err, decodedToken) => {
        if(err){
            return res.json({
                error: 'Unauthorized - Invalid token',
            });
        }

        const staffId = decodedToken.id;

        const staffExists = await StaffAuthModel.findById(staffId);
        if(!staffExists){
            return res.json({
                error: 'Staff does not exist',
            });
        }

        try {
            let product = await ProductModel.findById(productId);
            let productModel = 'Product';

            if(!product){
                product = await WorkinProgressProductModel.findById(productId);
                productModel = 'WorkinProgressProduct';
            }

            if(!product){
                return res.json({
                    error: 'Product does not exist in both ProductModel and WorkinProgressProductModel',
                });
            }

            const finalPrice = product.discountedPrice || product.price;

            let existingCartItem = await StaffCartModel.findOne({
                staffId,
                productId,
                productModel,
            });

            if(existingCartItem){
                //if item exists, update the quantity and finalPrice
                existingCartItem.quantity += quantity;
                existingCartItem.finalPrice = finalPrice;
                existingCartItem.updatedAt = Date.now();
                await existingCartItem.save();
            } else{
                await new StaffCartModel({
                    staffId,
                    productId,
                    productModel,
                    quantity,
                    finalPrice,
                    productName: product.productName,
                    sizeUnit: product.sizeUnit,
                    productSize: product.productSize,
                }).save();
            }

            const updatedCart = await StaffCartModel.find({staffId}).populate('productId');

            res.json(updatedCart);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Server error',
            });
        }
    });
};



// const getProductCartStaff = async(req, res) => {
//     const staffId = req.params.staffId;
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

//         if(decodedToken.id !== staffId){
//             return res.json({ 
//                 error: 'Unauthorized - Invalid customer ID'
//             });
//         }

//         try {
//             //fetch cart items for the customer
//             const cartItems = await StaffCartModel.find({staffId}).populate('productId');
//             res.json(cartItems);
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({ 
//                 message: 'Server error' 
//             });
//         }
//     });
// };
const getProductCartStaff = async(req, res) => {
    const staffId = req.params.staffId;
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

        if(decodedToken.id !== staffId){
            return res.json({ 
                error: 'Unauthorized - Invalid customer ID' 
            });
        }

        try {
            //fetch cart items with populated product details, including sizeUnit and productSize
            const cartItems = await StaffCartModel.find({staffId})
                .populate({
                    path: 'productId',
                    select: 'productName price imageUrl sizeUnit productSize'
                });
            res.json(cartItems);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ 
                message: 'Server error' 
            });
        }
    });
};

const removeProductFromCartStaff= async(req, res) => {
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
            await StaffCartModel.findByIdAndDelete(cartItemId);
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




const updateProductQuantityStaff = async(req, res) => {
    const {cartItemId, quantity} = req.body;

    try {
        //find the cart item and update the quantity
        const updatedItem = await StaffCartModel.findByIdAndUpdate(
            cartItemId,
            {quantity},
            {new: true}
        );

        if(!updatedItem){
            return res.status(404).json({ 
                success: false,
                message: 'Cart item not found'
            });
        }

        res.json({ 
            success: true, 
            message: 'Quantity updated successfully', 
            item: updatedItem 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};


// const updateProductSizeUnitAndProductSizeStaff 

module.exports = {
    addProductToCartStaff,
    getProductCartStaff,
    removeProductFromCartStaff,
    updateProductQuantityStaff
}