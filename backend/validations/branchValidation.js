const{body,validationResult} = require('express-validator');

exports.createBranchValidation = [
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .isString()
      .withMessage('Name must be a string'),
    body('parentId')
      .optional({ nullable: true })
      .isInt({ min: 1 })
      .withMessage('ParentId must be a positive integer or null'),
  ];
exports.deleteBranchValidation = [
    body('id')
    .optional({nullable:false})
    .isInt({min:1})
    .withMessage('Invalid branch ID')
]  
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
};  