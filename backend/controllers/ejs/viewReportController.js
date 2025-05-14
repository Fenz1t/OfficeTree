const e = require('express');
const reportService = require('../../services/reportService');


exports.renderReportsPage = async (req, res) => {
    try {
      const report = await reportService.generateEmployeeReport();
      
      res.render('pages/reports/list', {
        title: 'Справка по сотрудникам',
        reportData: report, 
        activePage: 'reports'
      });
  
    } catch (error) {
      console.error('Ошибка при формировании отчета:', error);
    }
  };

exports.generateReport = async(req,res) =>{
    try {
        const report = await reportService.generateEmployeeReport();
        res.json(report)
    } catch (error) {
       res.json(error) 
    }
}

