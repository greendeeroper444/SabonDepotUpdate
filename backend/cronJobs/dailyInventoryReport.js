const cron = require('node-cron');
const { createDailyInventoryReportAdmin, createDailySalesReportAdmin } = require('../controllers/AdminControllers/AdminReportController');
const { generateInventoryReport, generateSalesReport } = require('../helpers/DailyReport');

//schedule the job to run daily at midnight
// cron.schedule('0 0 * * *', async () => {
//     try {
//         //call the function to create the daily report
//         await createDailyInventoryReportAdmin({}, {});
//         console.log('Daily inventory report created successfully.');
//     } catch (error) {
//         console.error('Error generating daily inventory report:', error);
//     }
// });
// cron.schedule('0 0 * * *', async() => {
//     try {
//         //call the function to create the daily inventory report
//         await createDailyInventoryReportAdmin(null, {
//             status: (code) => ({ 
//                 json: (response) => console.log(`Inventory Report Response: ${response.message}`) 
//             }),
//         });

//         console.log('Daily inventory report created successfully.');

//         //call the function to create the daily sales report
//         await createDailySalesReportAdmin(null, {
//             status: (code) => ({ 
//                 json: (response) => console.log(`Sales Report Response: ${response.message}`) 
//             }),
//         });

//         console.log('Daily sales report created successfully.');
//     } catch (error) {
//         console.error('Error generating daily reports:', error);
//     }
// });
cron.schedule('0 0 * * *', async () => {
    console.log('Cron job triggered at midnight.');
    try {
        await generateInventoryReport();
        console.log('Inventory report created successfully.');
        
        await generateSalesReport();
        console.log('Sales report created successfully.');
    } catch (error) {
        console.error('Error generating daily reports:', error);
    }
});