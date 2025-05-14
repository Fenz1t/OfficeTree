//api
const branchRoutes = require('./api/branchRoutes');
const positionRoutes = require('./api/positionRoutes');
const employeeRoutes = require('./api/employeeRoutes');
const reportRoutes = require('./api/reportRoutes');
//ejs
const viewPositionRoutes = require('./ejs/viewPositionRoutes');
const viewReportRoutes = require('./ejs/viewReportRoutes');
const viewBranchRoutes = require('./ejs/viewBranchRoutes');

module.exports = {
  branchRoutes,
  positionRoutes,
  employeeRoutes,
  reportRoutes,
  viewPositionRoutes,
  viewReportRoutes,
  viewBranchRoutes
};