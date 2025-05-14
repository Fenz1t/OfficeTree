const branchService = require('../../services/branchService');
const positionService = require('../../services/positionSevice');
exports.renderBranchesPage = async(req,res) =>{
    try {
      const branchTree = await branchService.getBranchTree();
      const positions = await positionService.getAllPositions();
      res.render('pages/branches/list',{
        title: 'Филиалы',
        branchTree,
        positions,
        activePage: 'branches'
      })
      
    } catch (error) {
        console.error(error); 
    }
}
exports.HandleCreateBranch = async (req, res) => {
    try {
      const { name, parentId } = req.body;
      await branchService.createBranch(name, parentId ? parseInt(parentId) : null);
      res.redirect('/branches');
    } catch (error) {
      console.error(error);
    }
};
exports.getEmployeesByBranch = async (req, res) => {//ajax-запрос(названеи поэтому и отличается)
  const { branchId } = req.params;

  try {
      const employees = await branchService.getEmployeesByBranch(branchId, req.query);
      res.json(employees);
  } catch (error) {
      console.error(`Ошибка при получении сотрудников филиала ${branchId}:`, error);
      res.status(500).json({ error: 'Не удалось загрузить сотрудников' });
  }
};

exports.HandleDeleteBranch = async(req,res) =>{
     try {
        const deleted = await branchService.deleteBranch(req.params.id);
        if (deleted) {
            return res.json({ success: true });
        } else {
            return res.status(404).json({ success: false, message: 'Филиал не найден' });
        }

    } catch (error) {
        console.error('Ошибка при удалении филиала:', error);
        return res.status(500).json({ success: false, message: 'Ошибка сервера при удалении филиала' });
    }
}