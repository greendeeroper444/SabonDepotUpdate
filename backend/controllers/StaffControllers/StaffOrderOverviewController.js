const cron = require('node-cron');
const { BestSellingModel, TotalSaleModel } = require('../../models/SalesOverviewModel');
const OrderModel = require('../../models/OrderModel');


cron.schedule('0 0 * * *', async() => {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const today = new Date();

        //fetch all sales that occurred within the last 24 hours
        const sales = await TotalSaleModel.aggregate([
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
                    _id: {$dateToString: {format: '%Y-%m-%d', date: '$lastSoldAt' }},
                    totalSales: {$sum: '$totalSales'},
                    totalQuantity: {$sum: '$quantitySold'},
                }
            }
        ]);

        //create or update daily sales
        if(sales.length > 0){
            //save or update the total daily sales to a new collection or field
            console.log('Sales recorded:', sales);
        }
    } catch (error) {
        console.error('Error updating daily sales:', error);
    }
});


const getBestSellingProducts = async(req, res) => {
    try {
        //fetch best-selling products sorted by quantitySold
        const bestSellingProducts = await BestSellingModel.find()
            .populate('productId')
            .sort({quantitySold: -1})
            .limit(10);

        // //fetch daily sales data aggregated by date
        // const salesData = await BestSellingModel.aggregate([
        //     {
        //         $group: {
        //             _id: {$dateToString: {format: '%Y-%m-%d', date: '$lastSoldAt'}}, //group by date
        //             totalSales: {$sum: '$totalSales'}, //dum the totalSales for each date
        //         },
        //     },
        //     {$sort: {_id: 1}}, //dort by date ascending
        // ]);

        return res.status(200).json({
            bestSellingProducts,
            // salesData,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error',
        });
    }
};


const getTotalProductSales = async(req,res) => {
    try {
        //aggregate daily sales data
        const salesData = await TotalSaleModel.aggregate([
            {
                $group: {
                    _id: {$dateToString: {format: '%Y-%m-%d', date: '$updatedAt'}}, //group by day
                    totalSales: {$sum: '$totalSales'},
                    totalQuantity: {$sum: '$quantitySold'},
                }
            },
            {$sort: {_id: 1}} //sort by date ascending
        ]);

        return res.status(200).json({salesData});
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
}




const getDeliveredPendingCanceled = async(req, res) => {
    try {
        //count delivered orders where isDelivered is true
        const deliveredCount = await OrderModel.countDocuments({isDelivered: true});

        //count pending orders where isDelivered, isApproved, isShipped, and isOutForDelivery are all false
        const pendingCount = await OrderModel.countDocuments({ 
            isReceived: false, 
            isDelivered: false, 
            isConfirmed: false, 
            isShipped: false, 
            isOutForDelivery: false 
        });

        //count canceled orders where isCanceled is true
        const canceledCount = await OrderModel.countDocuments({isCanceled: true});

        res.json({
            delivered: deliveredCount,
            pending: pendingCount,
            canceled: canceledCount
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error counting delivered, pending, and canceled orders',
            error
        });
    }
};

module.exports = {
    getBestSellingProducts,
    getTotalProductSales,
    getDeliveredPendingCanceled
}