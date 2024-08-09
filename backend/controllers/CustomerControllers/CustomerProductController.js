const ProductModel = require("../../models/ProductModel");



const getProductCustomer = async(req, res) => { 
    const category = req.query.category;
    try {

        const query = category ? {category: category} : {};
        const customerProducts = await ProductModel.find(query);

        return res.json(customerProducts);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: 'Server error' 
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
        
        return res.json(productDetails);
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