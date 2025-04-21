const{body,validationResult} = require('express-validator');

exports.createEmployeeValidation = [
    body('branchId')
    .notEmpty().withMessage('branchId обязателен')
    .isInt({ min: 1 }).withMessage('branchId должен быть положительным числом'),
    body('fullName')
    .notEmpty().withMessage('ФИО обязательно')
    .isLength({ min: 3, max: 100 }).withMessage('ФИО должно быть от 3 до 100 символов'),
    body('positionId')
    .notEmpty().withMessage('positionId обязателен')
    .isInt({ min: 1 }).withMessage('positionId должен быть положительным числом'),
    body('salary')
    .notEmpty().withMessage('Оклад обязателен')
    .isFloat({ min: 0 }).withMessage('Оклад должен быть положительным числом'),
    body('hireDate')
    .notEmpty().withMessage('Дата приема обязательна')
    .isISO8601().withMessage('Некорректный формат даты (используйте YYYY-MM-DD)')
  ];
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
};  