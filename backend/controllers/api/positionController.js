const positionService = require('../../services/positionSevice');

exports.getAllPositions = async (req, res) => {
    try {
        const positions = await positionService.getAllPositions();
        res.status(200).json(positions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.createPosition = async (req, res) => {
    try {
        const { name } = req.body;
        const position = await positionService.createPosition(name);
        res.status(201).json(position);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getOnePosition = async (req, res) => {
    try {
        const { id } = req.params;
        const position = await positionService.getOnePosition(id);
        
        if (!position) {
            return res.status(404).json({ error: 'Должность не найдена' });
        }
        
        res.status(200).json(position);
    } catch (error) {
        res.status(500).json({ 
            error: 'Ошибка сервера', 
            details: error.message 
        });
    }
};

exports.updatePosition = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedPosition = await positionService.updatePosition(id, name);
        res.status(200).json(updatedPosition);
    } catch (error) {
        if (error.message === 'Должность не найдена') {
            return res.status(404).json({ error: error.message });
        }
        res.status(400).json({ error: error.message });
    }
};

exports.deletePosition = async (req, res) => {
    try {
        const { id } = req.params;
        await positionService.deletePosition(id);
        res.status(200).json({ message: 'Должность успешно удалена' });
    } catch (error) {
        if (error.message === 'Должность не найдена') {
            return res.status(404).json({ error: error.message });
        }
        res.status(400).json({ error: error.message });
    }
};