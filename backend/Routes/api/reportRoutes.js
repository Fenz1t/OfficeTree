const express = require("express");
const {getEmployeeReport} = require("../../controllers/api/reportController");

const router = express.Router();

router.get('/',getEmployeeReport)
module.exports = router