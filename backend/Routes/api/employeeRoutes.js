const express = require("express");
const {createEmployee,updateEmployee,deleteEmployee,getOneEmployee,getEmployeesList} = require("../../controllers/api/employeeController");
const {createEmployeeValidation,validate} = require("../../validations/employeeValidation");
const router = express.Router();

router.post('/',createEmployeeValidation,validate,createEmployee);
router.get('/:id',getOneEmployee);
router.patch('/:id',updateEmployee);
router.delete('/:id',deleteEmployee);
router.get('/',getEmployeesList);

module.exports = router