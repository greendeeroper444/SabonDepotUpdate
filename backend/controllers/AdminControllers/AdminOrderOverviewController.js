const ProductionReportModel = require("../../models/ProductionReportModel");


const getProductionReport = async(req, res) => {
    try {
        const productionData = await ProductionReportModel.find().populate('productId', 'productName');
        const formattedData = productionData.map(report => ({
            productName: report.productId.productName,
            date: report.date,
            quantity: report.productionQuantity
        }));

        res.json(formattedData);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error retrieving production data', 
            error 
        });
    }
};

const createProductionReport = async(req, res) => {
    const {productId, date, productionQuantity} = req.body;
    try {
        const newReport = new ProductionReportModel({ 
            productId, 
            date, 
            productionQuantity 
        });
        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating production report', 
            error 
        });
    }
};

module.exports = {
    getProductionReport,
    createProductionReport
};
