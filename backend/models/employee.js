'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Employee.belongsTo(models.Branch, { as: 'branch', foreignKey: 'branchId' });
      Employee.belongsTo(models.Position, { as: 'position', foreignKey: 'positionId' });
    }
  }
  Employee.init({
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'branches',
        key: 'id'
      }
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    positionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'positions',
        key: 'id'
      }
    },
    salary: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    hireDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees',
  });
  return Employee;
};