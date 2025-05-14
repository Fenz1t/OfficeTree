const express = require("express");
const {getAllPositions,createPosition,updatePosition,deletePosition,getOnePosition} = require("../../controllers/api/positionController");
const {createPositionValidation,updatePositionValidation,validate} = require("../../validations/positionValidation");

const router = express.Router();


router.post('/',createPositionValidation,validate,createPosition);
router.get('/',getAllPositions);
router.get('/:id',getOnePosition);
router.patch('/:id',updatePositionValidation,validate,updatePosition);
router.delete('/:id',deletePosition);

module.exports = router;


