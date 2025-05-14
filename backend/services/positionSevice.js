const { Position } = require('../models');

exports.getAllPositions = async () => {
    return await Position.findAll({
        attributes: ['id', 'name'],
        order: [['name', 'ASC']]
    });
};

exports.createPosition = async (name) => {
    if (!name) throw new Error("Название должности обязательно");
    return await Position.create({ name });
};

exports.getOnePosition = async (id) => {
    return await Position.findByPk(id, {
        attributes: ['id', 'name']
    });
};

exports.updatePosition = async (id, name) => {
    const [affectedRows] = await Position.update(
        { name },
        { where: { id } }
    );

    if (affectedRows === 0) {
        throw new Error('Должность не найдена');
    }

    return await Position.findByPk(id);
};

exports.deletePosition = async (id) => {
    const position = await Position.findByPk(id);
    
    if (!position) {
        throw new Error('Должность не найдена');
    }
    await position.destroy();
    return true;
};