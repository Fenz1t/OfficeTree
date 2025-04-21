const { Position } = require('../models');

exports.getAllPositions = async(req,res) => {
    try {
        const positions = await Position.findAll({
            attributes: ['id','name'],
        });
        res.status(200).json(positions);  
    } catch (error) {
        return res.status(400).json({ error: error.message });   
    }
}
exports.createPosition = async(req,res) => {
    try {
        const {name} = req.body;
        const position = await Position.create({name});
        return res.status(201).json(position)
    } catch (error) {
        return res.status(400).json({ error: error.message });   
    }
}
exports.getOnePosition = async(req,res) =>{
    try {
        const {id} = req.params;
        const position = await Position.findByPk(id,{
            attributes:[
                'id',
                'name'
            ],
        });
        if (!position) {
            return res.status(404).json({ error: 'Должность не найдена' });
        }
        res.status(200).json(position);
    } catch (error) {
        console.error('Ошибка при получении должности:', error);
        res.status(500).json({
            error: 'Ошибка сервера',
            details: error.message,
        });  
    }
}
exports.updatePosition = async(req,res) => {
    try {
        const {id} = req.params;
        const {name} = req.body;
        const [position] = await Position.update({name},{where: {id}});
    
        if(position){
            const updatePosition = await Position.findByPk(id);
            return res.status(200).json(updatePosition);
        }
        return res.status(404).json({ error: 'Должность не найдена' });
    } catch (error) {
        return res.status(400).json({ error: error.message });       
    }
   
}
exports.deletePosition = async(req,res) =>{
    try {
        const { id } = req.params;

        // Проверяем, существует ли запись с указанным ID
        const position = await Position.findByPk(id);

        if (!position) {
            return res.status(404).json({ error: 'Должность не найдена' });
        }
        await position.destroy();
        return res.status(200).json({ message: 'Должность успешно удалена' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}