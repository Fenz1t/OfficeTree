const { Op } = require('sequelize');
const { Branch,Employee,Position } = require('../models');
const {parseSortParams,parseFilterParams} = require('../services/branchService'); 

exports.getAllEmployeesByBranch = async (req, res) => {
  try {
      const { branchId } = req.params;
      const {sort,minSalary,maxSalary,fullName,positionId} = req.query;
      const allBranches = await Branch.findAll({
          attributes: ['id', 'parentId', 'name'],
          raw: true
      });

      const getAllChildIds = (parentId, collected = []) => {
          const children = allBranches.filter(b => b.parentId === parentId);
          for (const child of children) {
              collected.push(child.id);
              getAllChildIds(child.id, collected);
          }
          return collected;
      };
      const targetBranchIds = [parseInt(branchId), ...getAllChildIds(parseInt(branchId))];
      const filteredParams = parseFilterParams(req.query);
      
      filteredParams.branchId = {[Op.in]:targetBranchIds};
      const employees = await Employee.findAll({
          where: filteredParams,
          attributes: ['id', 'fullName'],
          include: [
            {
                model: Position,
                attributes: [],
                as: 'position' 
            },
          ],
          order: parseSortParams(sort),
          raw:true
      });

      res.status(200).json(employees);

  } catch (error) {
      console.error('Ошибка при получении сотрудников:', error);
      res.status(500).json({ 
          error: 'Ошибка сервера',
          details: error.message
      });
  }
};
exports.getBranchTree = async (req, res) => {
    try {
        const branches = await Branch.findAll({
            attributes: ['id','parentId','name'],
        })
        const buildTree = (branches,parentId=null) =>{
            return branches
            .filter(branch => branch.parentId===parentId)
            .map(branch=>({
                ...branch.toJSON(),
                children: buildTree(branches,branch.id)
            }));
        };
        const tree = buildTree(branches);

        res.status(200).json(tree);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
};

exports.createBranch = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const branch = await Branch.create({ name, parentId });
    return res.status(201).json(branch);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.deleteBranch = async (req, res) => {
    const { id } = req.params;
    const branch = await Branch.findByPk(id);
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    await branch.destroy();
    res.status(200).json({ message: 'Branch deleted successfully. Child branches have been updated.' });
};