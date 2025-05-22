const express = require("express");
const { createBranch,getBranchTree,deleteBranch,getAllEmployeesByBranch,getBranchesList } = require("../../controllers/api/branchController");
const { createBranchValidation,deleteBranchValidation,validate } = require('../../validations/branchValidation');


const router = express.Router();

router.post('/',createBranchValidation,validate,createBranch);
router.get('/',getBranchTree);
router.delete('/:id',deleteBranchValidation,validate,deleteBranch);
router.get('/:branchId/employees',getAllEmployeesByBranch);
router.get('/list',getBranchesList);

module.exports = router;