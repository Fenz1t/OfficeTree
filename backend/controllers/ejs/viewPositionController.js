const positionService = require('../../services/positionSevice');

exports.renderPositionsPage = async(req,res) =>{
    try {
        const positions = await positionService.getAllPositions();
        res.render('pages/positions/list',{
            title:'Справочник должностей',
            positions,
            activePage: 'positions'
        })

    } catch (error) {
        console.error(error);//ИСПРАВИТЬ СДЕЛАТЬ СТРАНИЦУ ДЛЯ ОШИБОК 
    }
}
exports.renderCreatePositionPage = async(req,res) =>{
    try {
        res.render('pages/positions/create',{
            title:'Создание новой должности',
            activePage:'positions',
            formData:req.body || {}
        })
    } catch (error) {
        console.error(error);
    }
}

exports.handleCreatePosition = async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).render('positions/create', { 
          error: 'Название обязательно',
          formData: req.body 
        });
      }
      await positionService.createPosition(name);
      res.redirect('/positions');
    } catch (error) {
      console.error(error);
      res.status(500).render('positions/create', { 
        error: 'Ошибка сервера',
        formData: req.body 
      });
    }
  };
  exports.renderEditPositionPage = async (req, res) => {
    try {
        const position = await positionService.getOnePosition(req.params.id); 
        
        if (!position) {
            return res.status(404).render('error', {
                message: 'Должность не найдена'
            });
        }
        res.render('pages/positions/edit', {
            title: 'Редактирование должности',
            position, 
            activePage: 'positions'
        });

    } catch (error) {
      console.error(error);
    }
}

exports.handleEditPosition = async(req,res) =>{
  try {
    await positionService.updatePosition(req.params.id,req.body.name);
    res.redirect('/positions')
  } catch (error) {
    const position = await positionService.getOnePosition(req.params.id);
    res.render('pages/positions/edit', {
        position,
        error: error.message,
        activePage: 'positions'
    });
  }
}

exports.handleDeletePosition = async (req, res) => {
  try {
    const isDeleted = await positionService.deletePosition(req.params.id);

    if (isDeleted) {
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error(error);

    if (error.message === 'Должность не найдена') {
      return res.status(404).json({ message: 'Должность не найдена' });
    }

    res.status(500).json({ message: 'Ошибка при удалении должности' });
  }
};