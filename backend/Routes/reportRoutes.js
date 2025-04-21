const express = require("express");
const {getEmployeeReport} = require("../controllers/ReportController");

const router = express.Router();

router.get('/',getEmployeeReport)
module.exports = router