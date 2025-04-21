const { Position } = require('../models');
const { Op } = require('sequelize');


exports.parseSortParams = (sortQuery) => {
    if(!sortQuery) return [['fullName','ASC']]

    return sortQuery.split(',').map(rule=>{
        const[field,direction] = rule.split(':');
        const validDirection = direction?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        if(field==='positionName') {
            return ['position.name',validDirection];
        }
        else if (['fullName','salary','birthDate','hireDate'].includes(field)){
            return[field,validDirection]
        }
        return ['fullName',validDirection];
    });
}

// Фильтрация(в задании указана сортировка, но не указана фильтрация).
exports.parseFilterParams = (queryParams) => {
    const filter = {};

    if(queryParams.minSalary) {
        filter.salary = {...filter.salary,[Op.gte]: parseFloat(queryParams.minSalary)};
    }
    if(queryParams.maxSalary){
        filter.salary = {...filter.salary,[Op.lte]: parseFloat(queryParams.maxSalary)};
    }
    if(queryParams.fullName){
        filter.fullName = {[Op.like]: `%${queryParams.fullName}$%`};
    }
    if(queryParams.positionId){
        filter.Position = parseInt(queryParams.positionId);
    }

    //фильтрация по дате рождения
    if (queryParams.minBirthDate) {
        filter.birthDate = { ...filter.birthDate, [Op.gte]: new Date(queryParams.minBirthDate) };
    }
    if (queryParams.maxBirthDate) {
        filter.birthDate = { ...filter.birthDate, [Op.lte]: new Date(queryParams.maxBirthDate) };
    }

    // Фильтрация по дате начала работы
    if (queryParams.minHireDate) {
        filter.hireDate = { ...filter.hireDate, [Op.gte]: new Date(queryParams.minHireDate) };
    }
    if (queryParams.maxHireDate) {
        filter.hireDate = { ...filter.hireDate, [Op.lte]: new Date(queryParams.maxHireDate) };
    }
    return filter
}