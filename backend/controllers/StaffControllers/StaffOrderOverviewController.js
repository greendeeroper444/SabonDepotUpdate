const SalesOverviewModel = require("../../models/SalesOverviewModel");
const cron = require('node-cron');

// const getBestSellingProducts = async (req, res) => {
//     try {
//         // Fetch top-selling products, sort by quantitySold (desc) or totalSales (desc)
//         const bestSellingProducts = await SalesOverviewModel.find()
//             .populate('productId') // Populate with product data from ProductModel
//             .sort({ quantitySold: -1 }) // Sort by most units sold
//             .limit(10); // Limit to top 10 best sellers, adjust as needed

//         // If no best-selling products found
//         if (!bestSellingProducts.length) {
//             return res.status(404).json({
//                 message: 'No best-selling products found',
//             });
//         }

//         // Respond with the best-selling products
//         return res.status(200).json(bestSellingProducts);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             message: 'Server error',
//         });
//     }
// };
cron.schedule('0 0 * * *', async () => {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const today = new Date();

        // Fetch all sales that occurred within the last 24 hours
        const sales = await SalesOverviewModel.aggregate([
            {
                $match: {
                    lastSoldAt: {
                        $gte: yesterday,
                        $lt: today
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$lastSoldAt" } },
                    totalSales: { $sum: "$totalSales" },
                    totalQuantity: { $sum: "$quantitySold" },
                }
            }
        ]);

        // Create or update daily sales
        if (sales.length > 0) {
            // Save or update the total daily sales to a new collection or field
            console.log('Sales recorded:', sales);
        }
    } catch (error) {
        console.error('Error updating daily sales:', error);
    }
});


const getBestSellingProducts = async (req, res) => {
    try {
        // Fetch best-selling products sorted by quantitySold
        const bestSellingProducts = await SalesOverviewModel.find()
            .populate('productId')
            .sort({ quantitySold: -1 })
            .limit(10);

        // Fetch daily sales data aggregated by date
        const salesData = await SalesOverviewModel.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$lastSoldAt" } }, // Group by date
                    totalSales: { $sum: "$totalSales" }, // Sum the totalSales for each date
                },
            },
            { $sort: { _id: 1 } }, // Sort by date ascending
        ]);

        return res.status(200).json({
            bestSellingProducts,
            salesData, // Send both best-selling products and sales data
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error',
        });
    }
};
module.exports = {
    getBestSellingProducts,
};