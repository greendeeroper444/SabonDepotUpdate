const multer = require('multer');
const path = require('path');
const ProductModel = require('../../models/ProductModel');
const StaffAuthModel = require('../../models/StaffModels/StaffAuthModel');
const jwt = require('jsonwebtoken');
const CartModel = require('../../models/CartModel');

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
            const {productName, category, price, quantity, discountPercentage = 0} = req.body;
            const imageUrl = req.file ? req.file.path : '';

            if(!productName || !category || !price || !quantity || !imageUrl){
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

                const newProduct = await ProductModel.create({
                    productCode: generateProductCode(),
                    productName,
                    category,
                    price,
                    discountedPrice,
                    quantity,
                    discountPercentage,
                    uploaderId: staffId,
                    uploaderType: 'Staff',
                    imageUrl,
                    createdBy: staffExists.fullName
                });

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
            message: 'Product archived successfully' 
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
            const {productCode, productName, category, price, quantity, discountPercentage = 0} = req.body;
            const imageUrl = req.file ? req.file.path : '';

            if(!productCode || !productName || !category || !price || !quantity){
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
            if(imageUrl){
                product.imageUrl = imageUrl;
            }

            const updatedProduct = await product.save();

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



module.exports = {
    uploadProductStaff,
    getProductStaff,
    deleteProductStaff,
    editProductStaff,
    getEditProductStaff
}