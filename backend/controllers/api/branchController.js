const { parseSortParams } = require('../../services/branchService');
const branchService = require('../../services/branchService');

exports.getAllEmployeesByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;

    // Вызываем service для получения сотрудников с фильтрацией и сортировкой
    const employees = await branchService.getEmployeesByBranch(branchId, req.query);

    return res.status(200).json(employees);
  } catch (error) {
    console.error('Ошибка при получении сотрудников:', error);
    return res.status(500).json({
      error: 'Ошибка сервера',
      details: error.message,
    });
  }
};

exports.getBranchTree = async (req, res) => {
  try {
    const tree = await branchService.getBranchTree();
    return res.status(200).json(tree);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.createBranch = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const branch = await branchService.createBranch(name, parentId);
    return res.status(201).json(branch);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await branchService.deleteBranch(id);
    if (!result) {
      return res.status(404).json({ error: 'Филиал не найден' });
    }
    return res.status(200).json({ message: 'Филиал успешно удален' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};