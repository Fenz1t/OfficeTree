const employeeService = require('../../services/employeeService');

exports.getOneEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await employeeService.getOneEmployee(id);
        res.status(200).json(employee);
    } catch (error) {
        if (error.message === 'Сотрудник не найден') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Ошибка при получении сотрудника:', error);
        res.status(500).json({
            error: 'Ошибка сервера',
            details: error.message,
        });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const employeeData = req.body;
        const createdEmployee = await employeeService.createEmployee(employeeData);
        res.status(201).json(createdEmployee);
    } catch (error) {
        if (error.message.includes('не найден')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(400).json({ error: error.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedEmployee = await employeeService.updateEmployee(id, updateData);
        res.status(200).json(updatedEmployee);
    } catch (error) {
        if (error.message === 'Сотрудник не найден' || 
           error.message === 'Должность не найдена' || 
           error.message === 'Филиал не найден') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Ошибка при обновлении сотрудника:', error);
        res.status(500).json({
            error: 'Ошибка сервера',
            details: error.message,
        });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await employeeService.deleteEmployee(id);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'Сотрудник не найден') {
            return res.status(404).json({ error: error.message });
        }
        res.status(400).json({ error: error.message });
    }
};