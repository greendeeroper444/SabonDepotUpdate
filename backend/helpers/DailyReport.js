const AdminInventoryReportModel = require("../models/AdminModels/AdminInventoryReportModel");
const SalesReportModel = require("../models/AdminModels/AdminSalesReportModel");
const ProductModel = require("../models/ProductModel");

//utility function to generate daily inventory report
const generateInventoryReport = async() => {
    const products = await ProductModel.find({ isArchived: false });
    const reportDate = new Date().setHours(0, 0, 0, 0);
    
    const reports = products.map(product => ({
        productId: product._id,
        productName: product.productName,
        sizeUnit: product.sizeUnit,
        category: product.category,
        quantity: product.quantity,
        reportDate,
    }));
    
    await AdminInventoryReportModel.insertMany(reports);
    console.log("Daily inventory report created successfully.");
};

//utility function to generate daily sales report
const generateSalesReport = async() => {
    const products = await ProductModel.find({ isArchived: false });
    const reportDate = new Date().setHours(0, 0, 0, 0);

    const reports = products.map(product => {
        const totalRevenue = product.quantity * product.price;
        const initialInventoryLevel = product.initialQuantity || product.quantity;
        const unitsSold = initialInventoryLevel - product.quantity;
        
        return {
            productId: product._id,
            productName: product.productName,
            productCode: product.productCode,
            sizeUnit: product.sizeUnit,
            category: product.category,
            price: product.price,
            inventoryLevel: product.quantity,
            unitsSold,
            totalRevenue,
            reportDate,
        };
    });
    
    await SalesReportModel.insertMany(reports);
    console.log("Daily sales report created successfully.");
};

module.exports = {
    generateInventoryReport,
    generateSalesReport,
};