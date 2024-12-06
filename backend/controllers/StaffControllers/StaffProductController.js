const multer = require('multer');
const path = require('path');
const ProductModel = require('../../models/ProductModel');
const StaffAuthModel = require('../../models/StaffModels/StaffAuthModel');
const jwt = require('jsonwebtoken');
const CartModel = require('../../models/CartModel');
const { getInventoryReport } = require('../AdminControllers/AdminReportController');
const mongoose = require('mongoose');
const WorkinProgressProductModel = require('../../models/WorkinProgressProductModel');

//set up storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/products');
    },
    // filename: function(req, file, cb){
    //     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    // }
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
}).single('image');

//check file type
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    } else{
        cb('Error: Images Only!');
    }
}


const uploadProductStaff = async(req, res) => {
    upload(req, res, async(err) => {
        if(err){
            return res.json({error: err});
        }

        try {
            const {productCode, productName, category, price, quantity, stockLevel, discountPercentage = 0, discountedDate, sizeUnit, productSize, expirationDate} = req.body;
            const imageUrl = req.file ? req.file.path : '';

            if(!productCode || !productName || !category || !price || !quantity || !stockLevel || !imageUrl || !productSize){
                return res.json({
                    error: 'Please provide all required fields'
                });
            }
            //check if the discountedDate is valid
            if(discountedDate && new Date(discountedDate) < new Date()){
                return res.json({
                    error: 'Discounted date must be today or a future date.',
                });
            }


            //calculate discountedPrice
            // const discountedPrice = price - (price * discountPercentage / 100);
            const discountedPrice =
                discountPercentage > 0
                    ? price - (price * discountPercentage) / 100
                    : price;

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

                // const generateProductCode = () => {
                //     const code1 = Math.floor(Math.random() * 10).toString();
                //     const code2 = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
                //     const code3 = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
                //     return `${code1} ${code2} ${code3}`;
                // };
                const today = new Date();
                const discountEnds = new Date(discountedDate);
                const isDiscountEnd = discountEnds.toDateString() === today.toDateString();

                const newProduct = await ProductModel.create({
                    productCode,
                    productName,
                    category,
                    price,
                    discountedPrice: isDiscountEnd ? price : discountedPrice,
                    discountPercentage: isDiscountEnd ? 0 : discountPercentage,
                    quantity,
                    stockLevel,
                    discountedDate,
                    imageUrl,
                    sizeUnit: sizeUnit || null,
                    productSize: productSize || null,
                    uploaderId: staffId,
                    uploaderType: 'Staff',
                    expirationDate,
                    createdBy: staffExists.fullName
                });


                await getInventoryReport(newProduct._id, productName, sizeUnit, productSize, category, quantity)

                return res.json({
                    message: 'Product added successfully!',
                    newProduct
                });
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Server error'
            });
        }
    });
};



// const getProductStaff = async(req, res) => {
//     try {

//         const token = req.cookies.token
//         if(!token){
//             return res.json({ 
//                 error: 'Unauthorized - Missing token' 
//             })
//         }

//         jwt.verify(token, process.env.JWT_SECRET, {}, async(err, decodedToken) => {
//             if(err){
//                 return res.json({ 
//                     error: 'Unauthorized - Invalid token' 
//                 })
//             }

//             const staffId = decodedToken.id

//             const staffExists = await StaffAuthModel.findById(staffId);
//             if(!staffExists){
//                 return res.json({ 
//                     error: 'staff does not exist' 
//                 })
//             }

//             //fetch lists for the authenticated staff
//             const staffProducts = await ProductModel.find({uploaderId: staffId})
//             return res.json(staffProducts)
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ 
//             message: 'Server error' 
//         });
//     }
// }
const getProductStaff = async(req, res) => {
    try {
        const staffProducts = await ProductModel.find();
        return res.json(staffProducts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}


const deleteProductStaff = async(req, res) => {
    try {
        const product = await ProductModel.findById(req.params.productId);
        if(!product){
            return res.status(404).json({ 
                message: 'Product not found' 
            });
        }

        await ProductModel.findByIdAndDelete(req.params.productId);

        //delete all cart items associated with the product
        await CartModel.deleteMany({productId: req.params.productId});

        return res.status(200).json({ 
            message: 'Product deleted successfully' 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};



const editProductStaff = async(req, res) => {
    upload(req, res, async(err) => {
        if(err){
            return res.json({error: err});
        }

        try {
            const {productId} = req.params;
            const {productCode, productName, category, price, quantity, stockLevel, discountPercentage = 0, discountedDate, sizeUnit, productSize, expirationDate} = req.body;
            const imageUrl = req.file ? req.file.path : '';

            if(!productCode || !productName || !category || !price || !stockLevel || !productSize || !expirationDate){
                return res.json({
                    error: 'Please provide all required fields'
                });
            }

            const product = await ProductModel.findById(productId);
            if(!product){
                return res.json({
                    error: 'Product not found'
                });
            }

            // //calculate discountedPrice
            // const discountedPrice = price - (price * discountPercentage / 100);
            //validate the discounted date
            const currentDate = new Date();
            let discountedPrice = price;

            if(discountPercentage > 0 && discountedDate && new Date(discountedDate) > currentDate){
                discountedPrice = price - (price * discountPercentage / 100);
            } else{
                //reset discount if expired or invalid
                product.discountPercentage = 0;
                product.discountedDate = null;
            }
 

            //update product fields
            product.productCode = productCode;
            product.productName = productName;
            product.category = category;
            product.price = price;
            product.discountedPrice = discountedPrice;
            product.quantity = quantity;
            product.stockLevel = stockLevel;
            product.discountPercentage = discountPercentage;
            product.sizeUnit = sizeUnit;
            product.productSize = productSize;
            product.expirationDate = expirationDate;
            product.discountedDate = discountedDate;
            if(imageUrl){
                product.imageUrl = imageUrl;
            }

            const updatedProduct = await product.save();

            await getInventoryReport(
                product._id, 
                productName, 
                expirationDate, 
                productSize, 
                category, 
                quantity
            )

            return res.json({
                message: 'Product updated successfully!',
                updatedProduct
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Server error'
            });
        }
    });
};



const getEditProductStaff = async(req, res) => {
    const {productId} = req.params;
    try {
        const product = await ProductModel.findById(productId);
        if(!product){
            return res.status(404).json({ 
                message: 'Product not found'
            });
        }
        res.json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};



//add product

const getProductShopStaff = async(req, res) => {
    const category = req.query.category;

    try {
        const query = category ? {category: category} : {};
        const staffProducts = await ProductModel.find(query);

        // Group by productName and then prioritize by sizeUnit and productSize
        const productMap = new Map();

        staffProducts.forEach(product => {
            const key = product.productName;

            if(!productMap.has(key)){
                productMap.set(key, product);
            } else {
                const existingProduct = productMap.get(key);

                const sizePriority = {
                    "Gallons": 3,
                    "Liters": 2,
                    "Milliliters": 1
                };

                const existingSizePriority = sizePriority[existingProduct.sizeUnit] || 0;
                const newSizePriority = sizePriority[product.sizeUnit] || 0;

                if(
                    newSizePriority > existingSizePriority ||
                    (newSizePriority === existingSizePriority && product.productSize > existingProduct.productSize)
                ){
                    productMap.set(key, product);
                }
            }
        });

        const prioritizedProducts = Array.from(productMap.values());

        return res.json(prioritizedProducts);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server error'
        });
    }
};

const getProductDetailsShopStaff = async(req, res) => {
    const productId = req.params.productId;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    try {
        const productDetails = await ProductModel.findById(productId);
        if(!productDetails){
            return res.status(404).json({ 
                error: 'Product not found.' 
            });
        }

        //get all products with the same productName to fetch available sizes and units
        const relatedProducts = await ProductModel.find({productName: productDetails.productName});

        //extract available sizes and units
        const sizesAndUnits = relatedProducts.map(product => ({
            sizeUnit: product.sizeUnit,
            productSize: product.productSize,
            productId: product._id
        }));

        //find related products (based on category)
        const moreRelatedProducts = await ProductModel.find({
            _id: {$ne: productId},  //exclude the current product
            category: productDetails.category //filter by the same category
        }).limit(5);

        return res.json({
            ...productDetails.toObject(),
            sizesAndUnits: sizesAndUnits,
            relatedProducts: moreRelatedProducts //iclude related products based on category
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};


// const getProductDetailsShopStaff = async(req, res) => {
//     const productId = req.params.productId;

//     try {
//         const productDetails = await ProductModel.findById(productId);
//         if(!productDetails){
//             return res.status(404).json({ 
//                 error: 'Product not found.' 
//             });
//         }

//         //gt all products with the same productName to fetch available sizes and units
//         const relatedProducts = await ProductModel.find({ productName: productDetails.productName });

//         //extract available sizes and units
//         const sizesAndUnits = relatedProducts.map(product => ({
//             sizeUnit: product.sizeUnit,
//             productSize: product.productSize,
//             productId: product._id
//         }));

//         return res.json({
//             ...productDetails.toObject(),
//             sizesAndUnits: sizesAndUnits
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ 
//             message: 'Server error' 
//         });
//     }
// };




//archived the product
const archiveProductStaff = async(req, res) => {
    // try {
    //     const {productId} = req.params;

    //     //find the product by ID and update the isArchived field
    //     const archivedProduct = await ProductModel.findByIdAndUpdate(
    //         productId, 
    //         {isArchived: true}, //update the isArchived field to true
    //         {new: true} //return the updated product
    //     );

    //     if(!archivedProduct){
    //         return res.status(404).json({
    //             message: 'Product not found'
    //         });
    //     }

    //     return res.status(200).json({
    //         message: 'Product archived successfully',
    //         product: archivedProduct
    //     });
    // } catch (error) {
    //     console.error(error);
    //     return res.status(500).json({
    //         message: 'Server error'
    //     });
    // }

    try {
        const {productId} = req.params;

        const product = await ProductModel.findById(productId);
        if(!product){
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        //toggle the isArchived field
        product.isArchived = !product.isArchived;
        await product.save();

        return res.status(200).json({ 
            message: product.isArchived ? 'Product archived successfully' : 'Product unarchived successfully',
            product
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};


//to get or notify the low quantity of product.
const getOutOfStockProducts = async (req, res) => {
    try {
        //fetch all products
        const products = await ProductModel.find();

        //filter the products where quantity < stockLevel
        const outOfStockProducts = products.filter(product => product.quantity < product.stockLevel);

        return res.json(outOfStockProducts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};



// const getProductsStaff = async (req, res) => {
//     const category = req.query.category;

//     try {
//         const query = {
//             ...(category ? {category: category} : {}),
//             isArchived: false,
//         };

//         //fetch all products that match the query without stock checks
//         const customerProducts = await ProductModel.find(query);

//         //group by productName and prioritize by sizeUnit and productSize
//         const productMap = new Map();

//         customerProducts.forEach(product => {
//             const key = product.productName;

//             if(!productMap.has(key)){
//                 productMap.set(key, product);
//             } else{
//                 const existingProduct = productMap.get(key);

//                 const sizePriority = {
//                     'Gallons': 3,
//                     'Liters': 2,
//                     'Milliliters': 1,
//                 };

//                 const existingSizePriority = sizePriority[existingProduct.sizeUnit] || 0;
//                 const newSizePriority = sizePriority[product.sizeUnit] || 0;

//                 if(
//                     newSizePriority > existingSizePriority ||
//                     (newSizePriority === existingSizePriority && product.productSize > existingProduct.productSize)
//                 ){
//                     productMap.set(key, product);
//                 }
//             }
//         });

//         const prioritizedProducts = Array.from(productMap.values());

//         return res.json(prioritizedProducts);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: 'Server error',
//         });
//     }
// };

const getProductsStaff = async (req, res) => {
    const category = req.query.category;

    try {
        const query = {
            ...(category ? {category: category} : {}),
            isArchived: false,
        };

        //fetch all products from ProductModel
        const customerProducts = await ProductModel.find(query);

        //fetch all products from WorkinProgressProductModel
        const workinProgressProducts = await WorkinProgressProductModel.find(query);

        //combine both product lists
        const allProducts = [...customerProducts, ...workinProgressProducts];

        //group by productName and prioritize by sizeUnit and productSize
        const productMap = new Map();

        allProducts.forEach(product => {
            const key = product.productName;

            if(!productMap.has(key)){
                productMap.set(key, product);
            } else{
                const existingProduct = productMap.get(key);

                const sizePriority = {
                    'Gallons': 3,
                    'Liters': 2,
                    'Milliliters': 1,
                };

                const existingSizePriority = sizePriority[existingProduct.sizeUnit] || 0;
                const newSizePriority = sizePriority[product.sizeUnit] || 0;

                if(
                    newSizePriority > existingSizePriority ||
                    (newSizePriority === existingSizePriority && product.productSize > existingProduct.productSize)
                ){
                    productMap.set(key, product);
                }
            }
        });

        const prioritizedProducts = Array.from(productMap.values());

        return res.json(prioritizedProducts);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server error',
        });
    }
};

const getProductDetailsStaff = async(req, res) => {
    const productId = req.params.productId;

    try {
        const productDetails = await ProductModel.findById(productId);
        if(!productDetails){
            return res.status(404).json({ 
                error: 'Product not found.' 
            });
        }

        //get all products with the same productName to fetch available sizes and units
        const relatedProducts = await ProductModel.find({productName: productDetails.productName});

        //extract available sizes and units
        const sizesAndUnits = relatedProducts.map(product => ({
            sizeUnit: product.sizeUnit,
            productSize: product.productSize,
            productId: product._id
        }));

        //find related products (based on category)
        const moreRelatedProducts = await ProductModel.find({
            _id: {$ne: productId},  //exclude the current product
            category: productDetails.category //filter by the same category
        }).limit(5);

        return res.json({
            ...productDetails.toObject(),
            sizesAndUnits: sizesAndUnits,
            relatedProducts: moreRelatedProducts //iclude related products based on category
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};

const getUniqueCategoriesStaff = async(req, res) => {
    try {
        const categories = await ProductModel.distinct('category');
        return res.json(categories);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};

module.exports = {
    uploadProductStaff,
    getProductStaff,
    deleteProductStaff,
    editProductStaff,
    getEditProductStaff,
    getProductShopStaff,
    getProductDetailsShopStaff,
    archiveProductStaff,
    getOutOfStockProducts,
    getProductsStaff,
    getProductDetailsStaff,
    getUniqueCategoriesStaff
}