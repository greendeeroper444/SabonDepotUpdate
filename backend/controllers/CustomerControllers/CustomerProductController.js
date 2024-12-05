const ProductModel = require("../../models/ProductModel");


const getProductCustomer = async (req, res) => {
    const category = req.query.category;

    try {
        const query = {
            ...(category ? {category: category} : {}),
            isArchived: false,
        };

        //fetch all products that match the query without stock checks
        const customerProducts = await ProductModel.find(query);

        //group by productName and prioritize by sizeUnit and productSize
        const productMap = new Map();

        customerProducts.forEach(product => {
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

const getProductDetailsCustomer = async(req, res) => {
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

const getUniqueCategoriesCustomer = async(req, res) => {
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
    getProductCustomer,
    getProductDetailsCustomer,
    getUniqueCategoriesCustomer
}