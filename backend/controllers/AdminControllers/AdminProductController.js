const multer = require('multer');
const path = require('path');
const ProductModel = require('../../models/ProductModel');
const jwt = require('jsonwebtoken');
const AdminAuthModel = require('../../models/AdminModels/AdminAuthModel');
const { getInventoryReport } = require('./AdminReportController');

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


const uploadProductAdmin = async(req, res) => {
    upload(req, res, async(err) => {
        if(err){
            return res.json({error: err});
        }

        try {
            const {productCode, productName, category, price, quantity, discountPercentage = 0, sizeUnit, productSize, expirationDate} = req.body;
            const imageUrl = req.file ? req.file.path : '';

            if(!productCode || !productName || !category || !price || !quantity || !imageUrl || !productSize || !expirationDate){
                return res.json({
                    error: 'Please provide all required fields'
                });
            }

            //calculate discountedPrice
            const discountedPrice = price - (price * discountPercentage / 100);

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

                const adminId = decodedToken.id;
                const adminExists = await AdminAuthModel.findById(adminId);
                if(!adminExists){
                    return res.json({
                        error: 'Admin does not exist'
                    });
                }

                // const generateProductCode = () => {
                //     const code1 = Math.floor(Math.random() * 10).toString();
                //     const code2 = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
                //     const code3 = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
                //     return `${code1} ${code2} ${code3}`;
                // };

                const newProduct = await ProductModel.create({
                    productCode,
                    productName,
                    category,
                    price,
                    discountedPrice,
                    quantity,
                    discountPercentage,
                    imageUrl,
                    sizeUnit: sizeUnit || null,
                    productSize: productSize || null,
                    uploaderId: adminId,
                    uploaderType: 'Admin',
                    expirationDate,
                    createdBy: adminExists.fullName
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


const getProductAdmin = async(req, res) => {
    try {
        const adminProducts = await ProductModel.find();
        return res.json(adminProducts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}



const deleteProductAdmin = async(req, res) => {
    try {
        const product = await ProductModel.findById(req.params.productId);
        if(!product){
            return res.status(404).json({ 
                message: 'Product not found' 
            });
        }

        await ProductModel.findByIdAndDelete(req.params.productId);

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



const editProductAdmin = async(req, res) => {
    upload(req, res, async(err) => {
        if(err){
            return res.json({error: err});
        }

        try {
            const {productId} = req.params;
            const {productCode, productName, category, price, quantity, discountPercentage = 0, sizeUnit, productSize, expirationDate} = req.body;
            const imageUrl = req.file ? req.file.path : '';

            if(!productCode || !productName || !category || !price || !quantity || !productSize || !expirationDate){
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

            //calculate discountedPrice
            const discountedPrice = price - (price * discountPercentage / 100);

            //update product fields
            product.productCode = productCode;
            product.productName = productName;
            product.category = category;
            product.price = price;
            product.discountedPrice = discountedPrice;
            product.quantity = quantity;
            product.discountPercentage = discountPercentage;
            product.sizeUnit = sizeUnit;
            product.productSize = productSize;
            product.expirationDate = expirationDate;
            if(imageUrl){
                product.imageUrl = imageUrl;
            }

            const updatedProduct = await product.save();


            await getInventoryReport(product._id, productName, sizeUnit, productSize, category, quantity);


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


const getEditProductAdmin = async(req, res) => {
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



// const getStatisticsAdmin = async(req, res) => {
//     try {
//         //count distinct categories
//         const categoryCount = await ProductModel.distinct('category').countDocuments();

//         //count total products
//         const totalProducts = await ProductModel.countDocuments();

//         //sum of all units produced (quantity field)
//         const totalUnitsProduced = await ProductModel.aggregate([
//             {$group: {_id: null, totalQuantity: {$sum: '$quantity'}}}
//         ]);

//         //count of low stock items (quantity < 10)
//         const lowStockCount = await ProductModel.countDocuments({quantity: {$lt: 10}});

//         res.json({
//             categoryCount,
//             totalProducts,
//             totalUnitsProduced: totalUnitsProduced[0]?.totalQuantity || 0,
//             lowStockCount
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: 'Server error'
//         });
//     }
// };
const getProductSummaryAdmin = async(req, res) => {
    try {

        //get the count of unique categories
        const categories = await ProductModel.distinct('category');
        const categoryCount = categories.length;

        //get the total number of products
        const totalProducts = await ProductModel.countDocuments();

        //calculate the total value (sum of price * quantity for each product)
        const totalValueResult = await ProductModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalValue: {$sum: {$multiply: ['$price', '$quantity']}}
                }
            }
        ]);
        const totalValue = totalValueResult[0]?.totalValue || 0;

        //get the total units produced (sum of all product quantities)
        const totalUnitsProduced = await ProductModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalQuantity: {$sum: '$quantity'}
                }
            }
        ]);

        //get the count of products with low stock (quantity < 10)
        const lowStockCount = await ProductModel.countDocuments({quantity: {$lt: 10}});
        const notInStock = await ProductModel.countDocuments({ quantity: 0 });

        res.json({
            categoryCount,
            totalProducts,
            totalUnitsProduced: totalUnitsProduced[0]?.totalQuantity || 0,
            totalValue,
            lowStockCount,
            notInStock
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
};

//to get or notify the low quantity of product.
const getOutOfStockProductsAdmin = async(req, res) => {
    try {
        const outOfStockProducts = await ProductModel.find({quantity: {$lt: 10}});
        return res.json(outOfStockProducts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};

module.exports = {
    uploadProductAdmin,
    getProductAdmin,
    deleteProductAdmin,
    editProductAdmin,
    getEditProductAdmin,
    // getStatisticsAdmin,
    getProductSummaryAdmin,
    getOutOfStockProductsAdmin
}