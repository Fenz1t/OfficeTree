const express = require("express");

const viewPositionController = require('../../controllers/ejs/viewPositionController');

const router = express.Router();
router.get('/',viewPositionController.renderPositionsPage);

router.get('/create',viewPositionController.renderCreatePositionPage);
router.post('/',viewPositionController.handleCreatePosition);

router.get('/:id/edit',viewPositionController.renderEditPositionPage);
router.patch('/:id',viewPositionController.handleEditPosition);
router.delete('/:id',viewPositionController.handleDeletePosition);

module.exports = router;
