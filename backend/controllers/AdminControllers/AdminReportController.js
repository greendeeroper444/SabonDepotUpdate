const { generateInventoryReport, generateSalesReport } = require("../../helpers/DailyReport");
const AdminInventoryReportModel = require("../../models/AdminModels/AdminInventoryReportModel");
const SalesReportModel = require("../../models/AdminModels/AdminSalesReportModel");
const ProductModel = require("../../models/ProductModel");

const getInventoryReport = async(productId, productName, sizeUnit, productSize, category, orderQuantity, isOrder = false) => {
    const reportDate = new Date();
    reportDate.setHours(0, 0, 0, 0);

    //define today's date range for the query to limit to current day's records only
    const startOfDay = reportDate;
    const endOfDay = new Date(reportDate.getTime() + 24 * 60 * 60 * 1000);

    //check for an existing report for the same product on the current date
    let existingReport = await AdminInventoryReportModel.findOne({
        productId,
        reportDate: {
            $gte: startOfDay,
            $lt: endOfDay
        }
    });

    if(existingReport){
        //update existing report if it's already created for today
        existingReport.productName = productName;
        existingReport.sizeUnit = sizeUnit;
        existingReport.productSize = productSize;
        existingReport.category = category;

        if(isOrder){
            //subtract the ordered quantity from the current quantity
            existingReport.quantity -= orderQuantity;
        } else{
            //set quantity directly if not an order (e.g., inventory update)
            existingReport.quantity = orderQuantity;
        }

        await existingReport.save();
    } else{
        //if no report exists for today, create a new report
        const currentProduct = await ProductModel.findById(productId).select('quantity');
        const initialQuantity = isOrder 
            ? currentProduct.quantity - orderQuantity
            : orderQuantity;

        await AdminInventoryReportModel.create({
            productId,
            productName,
            sizeUnit,
            productSize,
            category,
            quantity: initialQuantity,
            reportDate: startOfDay
        });
    }
};




//gey invnetory report
const getInventoryReportsAdmin = async(req, res) => {
    try {
        const adminInventoryReports = await AdminInventoryReportModel.find();
        return res.json(adminInventoryReports);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}






const getSalesReport = async(
    productId,
    productName,
    sizeUnit,
    category,
    price,
    unitsSold,
) => {
    try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        //find the product to retrieve inventory details
        const product = await ProductModel.findById(productId);
        if(!product){
            throw new Error("Product not found");
        }

        //get or create a sales report entry for today
        let salesReport = await SalesReportModel.findOne({
            productId,
            reportDate: today,
        });

        if(salesReport){
            //update the existing sales report for today
            salesReport.unitsSold += unitsSold;
            salesReport.totalRevenue += product.price * unitsSold;
            salesReport.inventoryLevel = product.quantity;
        } else{
            //create a new sales report entry for today
            salesReport = new SalesReportModel({
                productId,
                productName,
                productCode: product.productCode,
                sizeUnit,
                category,
                price: product.price,
                inventoryLevel: product.quantity,
                unitsSold,
                totalRevenue: product.price * unitsSold,
                initialQuantity: product.quantity + unitsSold,
                reportDate: today,
            });
        }

        //save the report
        await salesReport.save();

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

//get sales reports
const getSalesReportsAdmin = async(req, res) => {
    try {
        const adminsalesReports = await SalesReportModel.find();
        return res.json(adminsalesReports);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};

module.exports = {
    // createDailyInventoryReportAdmin,
    getInventoryReportsAdmin,
    // createDailySalesReportAdmin,
    getSalesReportsAdmin,
    getInventoryReport,
    getSalesReport
}