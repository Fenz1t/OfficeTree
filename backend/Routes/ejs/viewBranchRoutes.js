const express = require("express");

const viewBranchController = require('../../controllers/ejs/viewBranchController');
const viewEmployeeController = require('../../controllers/ejs/viewEmployeeController');
const router = express.Router();

router.get('/',viewBranchController.renderBranchesPage);
router.post('/',viewBranchController.HandleCreateBranch);
router.delete('/:id',viewBranchController.HandleDeleteBranch);
router.get('/:branchId/employees', viewBranchController.getEmployeesByBranch);

//методы для сотрудников(получение сотрудников относится к самому филиалу)
router.get('/employees/:id',viewEmployeeController.getOneEmployee);
router.post('/employees',viewEmployeeController.createEmployee);
router.patch('/employees/:id',viewEmployeeController.updateEmployee);
router.delete('/employees/:id',viewEmployeeController.deleteEmployee);


module.exports = router;