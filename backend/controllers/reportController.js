const { Employee,Branch } = require('../models');
const { Op, } = require('sequelize');

exports.getEmployeeReport = async (req, res) => {
    try {
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
  
      const mainBranches = await Branch.findAll({
        where: { parentId: null },
        include: [
          {
            model: Employee,
            where: {
              hireDate: { [Op.lt]: threeYearsAgo },
              salary: { [Op.lt]: 30000 }
            },
            required: false
          },
          {
            model: Branch,
            as: 'childrend',
            include: [{
              model: Employee,
              where: {
                hireDate: { [Op.lt]: threeYearsAgo },
                salary: { [Op.lt]: 30000 }
              },
              required: false
            }]
          }
        ],
        order: [
          ['name', 'ASC'],
          [{ model: Branch, as: 'childrend' }, 'name', 'ASC']
        ]
      });
      const formatBranch = (branch) => {
        const employees = branch.Employees ? branch.Employees.map(emp => ({
          id: emp.id,
          fullName: emp.fullName,
          salary: emp.salary,
        })) : [];
  
        const children = branch.childrend ? branch.childrend.map(child => formatBranch(child)) : [];
  
        return {
          id: branch.id,
          name: branch.name,
          employees,
          children,
          hasChildren: children.length > 0//возможно понадобится для фронта
        };
      };
  
      const report = mainBranches.map(formatBranch);
  
      res.status(200).json(report);
    } catch (error) {
      console.error('Error in getEmployeeReport:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };