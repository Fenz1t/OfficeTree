const { Employee, Position, Branch } = require('../models');
const { Op, col } = require('sequelize');

exports.getOneEmployee = async(id)=>{
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
            { model: Position, attributes: [], as: 'position' },
            { model: Branch, attributes: [], as: 'branch' },
        ],
    });

    if (!employee) throw new Error('Сотрудник не найден');
    return employee;
}
exports.createEmployee = async (employeeData) => {
    const requiredFields = ['branchId', 'fullName', 'positionId','birthDate', 'salary', 'hireDate'];
    for (const field of requiredFields) {
        if (!employeeData[field]) {
            throw new Error(`Поле ${field} обязательно для заполнения`);
        }
    }

    const branch = await Branch.findByPk(employeeData.branchId);
    if (!branch) {
        throw new Error('Филиал с указанным branchId не найден');
    }

    const position = await Position.findByPk(employeeData.positionId);
    if (!position) {
        throw new Error('Должность с указанным positionId не найдена');
    }

    const employee = await Employee.create({
        branchId: employeeData.branchId,
        fullName: employeeData.fullName,
        birthDate: employeeData.birthDate, 
        positionId: employeeData.positionId,
        salary: employeeData.salary,
        hireDate: employeeData.hireDate
    });

    return this.getOneEmployee(employee.id);
};
exports.updateEmployee = async (id, updateData) => {
    const employee = await Employee.findByPk(id);
    if (!employee) {
        throw new Error('Сотрудник не найден');
    }

    if (updateData.positionId) {
        const position = await Position.findByPk(updateData.positionId);
        if (!position) {
            throw new Error('Должность не найдена');
        }
    }

    if (updateData.branchId) {
        const branch = await Branch.findByPk(updateData.branchId);
        if (!branch) {
            throw new Error('Филиал не найден');
        }
    }

    await employee.update({
        fullName: updateData.fullName ?? employee.fullName,
        birthDate: updateData.birthDate ?? employee.birthDate,
        positionId: updateData.positionId ?? employee.positionId,
        salary: updateData.salary ?? employee.salary,
        hireDate: updateData.hireDate ?? employee.hireDate,
        branchId: updateData.branchId ?? employee.branchId
    });

    return this.getOneEmployee(id);
};
exports.deleteEmployee = async (id) => {
    const employee = await Employee.findByPk(id);
    if (!employee) {
        throw new Error('Сотрудник не найден');
    }
    await employee.destroy();
    return { message: 'Сотрудник успешно удален' };
};