const { Employee, Branch } = require('../models');
const { Op } = require('sequelize');

exports.generateEmployeeReport = async () => {
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

  const loadBranches = async (parentId = null) => {
    const branches = await Branch.findAll({
      where: { parentId },
      attributes: ['id', 'name'], 
      include: [
        {
          model: Employee,
          attributes: ['id', 'fullName', 'salary'], 
          where: {
            hireDate: { [Op.lt]: threeYearsAgo },
            salary: { [Op.lt]: 30000 }
          },
          required: false
        },
        {
          model: Branch,
          as: 'childrend',
          attributes: ['id', 'name'],
          include: [{
            model: Employee,
            attributes: ['id', 'fullName', 'salary'],
            where: {
              hireDate: { [Op.lt]: threeYearsAgo },
              salary: { [Op.lt]: 30000 }
            },
            required: false
          }]
        }
      ]
    });

    for (const branch of branches) {
      branch.children = await loadBranches(branch.id);
      branch.children = branch.children.filter(child => 
        child.Employees.length > 0 || child.children.length > 0
      );
    }

    return branches.filter(branch => 
      branch.Employees.length > 0 || branch.children.length > 0
    );
  };

  const rootBranches = await loadBranches();

  const collectEmployees = (branch) => {
    let employees = branch.Employees.map(emp => ({
      id: emp.id,
      fullName: emp.fullName,
      salary: emp.salary,
      branchName: branch.name
    }));

    branch.children.forEach(child => {
      employees = employees.concat(collectEmployees(child));
    });

    return employees;
  };

  const formatBranch = (branch) => ({
    id: branch.id,
    name: branch.name,
    employees: collectEmployees(branch),
    hasChildren: branch.children.length > 0
  });

  return rootBranches.map(formatBranch);
};