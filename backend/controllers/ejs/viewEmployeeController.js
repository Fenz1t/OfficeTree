const employeeService = require('../../services/employeeService');

//Отдаю не страницу поскольку, у нас все делается на страницу branches(используем ajax-запросы)

exports.getOneEmployee = async(req,res) =>{
    const {id} = req.params;
    try {
       const employee = await employeeService.getOneEmployee(id);
       res.json(employee) 
    } catch (error) {
        res.status(404).json({error:error.message});
    }
}

exports.createEmployee = async (req, res) => {
    try {
        const employee = await employeeService.createEmployee(req.body);
        res.json(employee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.updateEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        await employeeService.updateEmployee(id, req.body);
        res.json({ message: 'Сотрудник обновлен' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        await employeeService.deleteEmployee(id);
        res.json({ message: 'Сотрудник удален' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}