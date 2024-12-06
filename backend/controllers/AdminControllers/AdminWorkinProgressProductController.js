const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const AdminAuthModel = require('../../models/AdminModels/AdminAuthModel');
const { getInventoryReport } = require('./AdminReportController');
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


const uploadWorkinProgressProductAdmin = async(req, res) => {
    upload(req, res, async(err) => {
        if(err){
            return res.json({error: err});
        }

        try {
            const {productCode, productName, category, price, quantity, discountPercentage = 0, expirationDate} = req.body;
            const imageUrl = req.file ? req.file.path : '';

            if(!productCode || !productName || !category || !price || !quantity || !imageUrl || !expirationDate){
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

                const newProduct = await WorkinProgressProductModel.create({
                    productCode,
                    productName,
                    category,
                    price,
                    discountedPrice,
                    quantity,
                    discountPercentage,
                    imageUrl,
                    sizeUnit: 'Drums',
                    productSize: 'Drum',
                    uploaderId: adminId,
                    uploaderType: 'Admin',
                    expirationDate,
                    createdBy: adminExists.fullName
                });

                // await getInventoryReport(newProduct._id, productName, category, quantity)

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


const getWorkinProgressProductAdmin = async(req, res) => {
    try {
        const adminProducts = await WorkinProgressProductModel.find();
        return res.json(adminProducts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}



const deleteWorkinProgressProductAdmin = async(req, res) => {
    try {
        const product = await WorkinProgressProductModel.findById(req.params.productId);
        if(!product){
            return res.status(404).json({ 
                message: 'Product not found' 
            });
        }

        await WorkinProgressProductModel.findByIdAndDelete(req.params.productId);

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



const editWorkinProgressProductAdmin = async(req, res) => {
    upload(req, res, async(err) => {
        if(err){
            return res.json({error: err});
        }

        try {
            const {productId} = req.params;
            const {productCode, productName, category, price, quantity, discountPercentage = 0, expirationDate} = req.body;
            const imageUrl = req.file ? req.file.path : '';

            if(!productCode || !productName || !category || !price || !quantity || !expirationDate){
                return res.json({
                    error: 'Please provide all required fields'
                });
            }

            const product = await WorkinProgressProductModel.findById(productId);
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
            // product.sizeUnit = sizeUnit;
            // product.productSize = productSize;
            product.expirationDate = expirationDate;
            if(imageUrl){
                product.imageUrl = imageUrl;
            }

            const updatedProduct = await product.save();


            // await getInventoryReport(product._id, productName, category, quantity);


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


const getEditWorkinProgressProductAdmin = async(req, res) => {
    const {productId} = req.params;
    try {
        const product = await WorkinProgressProductModel.findById(productId);
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
//         const categoryCount = await WorkinProgressProductModel.distinct('category').countDocuments();

//         //count total products
//         const totalProducts = await WorkinProgressProductModel.countDocuments();

//         //sum of all units produced (quantity field)
//         const totalUnitsProduced = await WorkinProgressProductModel.aggregate([
//             {$group: {_id: null, totalQuantity: {$sum: '$quantity'}}}
//         ]);

//         //count of low stock items (quantity < 10)
//         const lowStockCount = await WorkinProgressProductModel.countDocuments({quantity: {$lt: 10}});

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
const getWorkinProgressProductSummaryAdmin = async(req, res) => {
    try {

        //get the count of unique categories
        const categories = await WorkinProgressProductModel.distinct('category');
        const categoryCount = categories.length;

        //get the total number of products
        const totalProducts = await WorkinProgressProductModel.countDocuments();

        //calculate the total value (sum of price * quantity for each product)
        const totalValueResult = await WorkinProgressProductModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalValue: {$sum: {$multiply: ['$price', '$quantity']}}
                }
            }
        ]);
        const totalValue = totalValueResult[0]?.totalValue || 0;

        //get the total units produced (sum of all product quantities)
        const totalUnitsProduced = await WorkinProgressProductModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalQuantity: {$sum: '$quantity'}
                }
            }
        ]);

        //get the count of products with low stock (quantity < 10)
        const lowStockCount = await WorkinProgressProductModel.countDocuments({quantity: {$lt: 10}});
        const notInStock = await WorkinProgressProductModel.countDocuments({ quantity: 0 });

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
const getWorkinProgressOutOfStockProductsAdmin = async(req, res) => {
    try {
        const outOfStockProducts = await WorkinProgressProductModel.find({quantity: {$lt: 10}});
        return res.json(outOfStockProducts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};

module.exports = {
    uploadWorkinProgressProductAdmin,
    getWorkinProgressProductAdmin,
    deleteWorkinProgressProductAdmin,
    editWorkinProgressProductAdmin,
    getEditWorkinProgressProductAdmin,
    // getStatisticsAdmin,
    getWorkinProgressProductSummaryAdmin,
    getWorkinProgressOutOfStockProductsAdmin
}