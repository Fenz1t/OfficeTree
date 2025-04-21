const express = require("express");
const {createEmployee,updateEmployee,deleteEmployee,getOneEmployee} = require("../controllers/EmployeeController")
const {createEmployeeValidation,validate} = require("../validations/employeeValidation")
const router = express.Router();

router.post('/',createEmployeeValidation,validate,createEmployee)
router.get('/:id',getOneEmployee)
router.patch('/:id',updateEmployee)
router.delete('/:id',deleteEmployee)

module.exports = router