const { Branch, Employee, Position } = require("../models");
const { Op, col, Sequelize } = require("sequelize");

//Множественная сортировка и фильтрация для сотрудников(поскольку список сотрудников мы получать будем именно на роуте с офисами)
exports.parseSortParams = (sortQuery) => {
  if (!sortQuery) return [["fullName", "ASC"]];

  return sortQuery.split(",").map((rule) => {
    const [field, direction] = rule.split(":");
    const validDirection = direction?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    if (field === "positionName") {
      return [Sequelize.col("position.name"), validDirection];
    } else if (
      ["fullName", "salary", "birthDate", "hireDate"].includes(field)
    ) {
      return [field, validDirection];
    }
    return ["fullName", validDirection];
  });
};

// Фильтрация(в задании указана сортировка, но не указана фильтрация).
exports.parseFilterParams = (queryParams) => {
  const filter = {};

  if (queryParams.minSalary) {
    filter.salary = {
      ...filter.salary,
      [Op.gte]: parseFloat(queryParams.minSalary),
    };
  }
  if (queryParams.maxSalary) {
    filter.salary = {
      ...filter.salary,
      [Op.lte]: parseFloat(queryParams.maxSalary),
    };
  }
  if (queryParams.fullName) {
    filter.fullName = { [Op.like]: `%${queryParams.fullName}%` };
  }
  if (queryParams.positionId) {
    filter.positionId = parseInt(queryParams.positionId);
  }

  //фильтрация по дате рождения
  if (queryParams.minBirthDate) {
    filter.birthDate = {
      ...filter.birthDate,
      [Op.gte]: new Date(queryParams.minBirthDate),
    };
  }
  if (queryParams.maxBirthDate) {
    filter.birthDate = {
      ...filter.birthDate,
      [Op.lte]: new Date(queryParams.maxBirthDate),
    };
  }

  // Фильтрация по дате начала работы
  if (queryParams.minHireDate) {
    filter.hireDate = {
      ...filter.hireDate,
      [Op.gte]: new Date(queryParams.minHireDate),
    };
  }
  if (queryParams.maxHireDate) {
    filter.hireDate = {
      ...filter.hireDate,
      [Op.lte]: new Date(queryParams.maxHireDate),
    };
  }
  return filter;
};

exports.getEmployeesByBranch = async (branchId, queryParams) => {
  const allBranches = await Branch.findAll({
    attributes: ["id", "parentId", "name"],
    raw: true,
  });

  const getAllChildIds = (parentId, collected = []) => {
    const children = allBranches.filter((b) => b.parentId === parentId);
    for (const child of children) {
      collected.push(child.id);
      getAllChildIds(child.id, collected);
    }
    return collected;
  };

  const targetBranchIds = [
    parseInt(branchId),
    ...getAllChildIds(parseInt(branchId)),
  ];

  const filteredParams = this.parseFilterParams(queryParams);
  filteredParams.branchId = { [Op.in]: targetBranchIds };

  return await Employee.findAll({
    where: filteredParams,
    attributes: [
      "id",
      "fullName",
      "birthDate",
      "salary",
      "hireDate",
      "positionId",
      [col("position.name"), "positionName"],
    ],
    include: [
      {
        model: Position,
        attributes: [],
        as: "position",
      },
    ],
    order: this.parseSortParams(queryParams.sort),
    raw: true,
  });
};

exports.getBranchTree = async () => {
  const branches = await Branch.findAll({
    attributes: ["id", "parentId", "name"],
  });

  const buildTree = (items, parentId = null) => {
    return items
      .filter((item) => item.parentId === parentId)
      .map((item) => ({
        id: item.id,
        parentId: item.parentId,
        name: item.name,
        children: buildTree(items, item.id),
      }));
  };

  return buildTree(branches);
};
exports.getBranchesList = async () => {
  const branches = await Branch.findAll({
    attributes: ["id", "name", "parentId"],
  });
  return branches;
};

exports.createBranch = async (name, parentId) => {
  return await Branch.create({
    name,
    parentId: parentId || null,
  });
};

exports.deleteBranch = async (id) => {
  const branch = await Branch.findByPk(id);
  if (!branch) return null;

  await branch.destroy();
  return true;
};
