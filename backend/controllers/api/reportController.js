const reportService = require('../../services/reportService');

exports.getEmployeeReport = async (req, res) => {
    try {
        const report = await reportService.generateEmployeeReport();
        res.status(200).json(report);
    } catch (error) {
        console.error('Error in getEmployeeReport:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};