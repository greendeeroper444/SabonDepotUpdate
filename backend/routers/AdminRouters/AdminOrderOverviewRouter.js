const express = require('express');
const { getProductionReport, createProductionReport } = require('../../controllers/AdminControllers/AdminOrderOverviewController');

const router = express.Router();

router.get('/getProductionReport', getProductionReport);
router.post('/createProductionReport', createProductionReport);

module.exports = router;
