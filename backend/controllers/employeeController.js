const { Employee,Position,Branch } = require('../models');
const { Op, col } = require('sequelize');

exports.getOneEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id, {
            attributes: [
                'id',
                'fullName',
                'birthDate',
                'salary',
                'hireDate',
                [col('position.name'), 'positionName'], 
                [col('branch.name'), 'branchName'],     
            ],
            include: [
                {
                    model: Position,
                    attributes: [],
                    as: 'position' 
                },
                {
                    model: Branch,
                    attributes: [], 
                    as: 'branch' 
                },
            ],
        });

        if (!employee) {
            return res.status(404).json({ error: 'Сотрудник не найден' });
        }
        res.status(200).json(employee);
    } catch (error) {
        console.error('Ошибка при получении сотрудника:', error);
        res.status(500).json({
            error: 'Ошибка сервера',
            details: error.message,
        });
    }
};
exports.createEmployee = async(req,res) => {
    try {
        const {branchId,fullName,birthDate,positionId,salary,hireDate} = req.body;
          const position = await Position.findByPk(positionId);
          console.log(position)
          if (!position) {
              return res.status(404).json({ error: 'Должность с указанным positionId не найдена' });
          }
          const branch = await Branch.findByPk(branchId);
          if (!branch) {
              return res.status(404).json({ error: 'Филиал с указанным branchId не найден' });
          }
        const employee = await Employee.create({branchId,fullName,birthDate,positionId,salary,hireDate});

            return res.status(201).json({
            id: employee.id,
            fullName: employee.fullName,
            position: position.name,
            salary:employee.salary, 
            branchId: employee.branchId,
            hireDate: employee.hireDate
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });   
    }
}

exports.updateEmployee = async(req,res) => {
    try {
        const { id } = req.params;
        const { fullName, birthDate, positionId, salary, hireDate, branchId } = req.body;

        const employee = await Employee.findByPk(id);
        if (!employee) {
            return res.status(404).json({ error: 'Сотрудник не найден' });
        }

        if (positionId) {
            const position = await Position.findByPk(positionId);
            if (!position) return res.status(404).json({ error: 'Должность не найдена' });
        }

        if (branchId) {
            const branch = await Branch.findByPk(branchId);
            if (!branch) return res.status(404).json({ error: 'Филиал не найден' });
        }
        await employee.update({
            fullName: fullName ?? employee.fullName,
            birthDate: birthDate ?? employee.birthDate,
            positionId: positionId ?? employee.positionId,
            salary: salary ?? employee.salary,
            hireDate: hireDate ?? employee.hireDate,
            branchId: branchId ?? employee.branchId
        });

        const updatedEmployee = await Employee.findByPk(id, {
        attributes: [
            'id',
            'fullName',
            'birthDate',
            'salary',
            'hireDate',
            [col('position.name'), 'positionName'], 
            [col('branch.name'), 'branchName'],     
        ],
        include: [
            {
                model: Position,
                attributes: [],
                as: 'position'
            },
            {
                model: Branch,
                attributes: [],
                as: 'branch'
            }
        ],
    });

    res.status(200).json(updatedEmployee);
    } catch (error) {
        console.error('Ошибка при получении сотрудника:', error);
        res.status(500).json({
            error: 'Ошибка сервера',
            details: error.message,
        });   
    }
}

exports.deleteEmployee = async(req,res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findByPk(id);

        if (!employee) {
            return res.status(404).json({ error: 'Сотруднник не найден' });
        }
        await employee.destroy();
        return res.status(200).json({ message: 'Сотрудник успешно удален' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}
