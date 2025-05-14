const express = require("express");

const viewReportController = require('../../controllers/ejs/viewReportController');

const router = express.Router();

router.get('/',viewReportController.renderReportsPage);
router.get('/json',viewReportController.generateReport);

module.exports = router;
