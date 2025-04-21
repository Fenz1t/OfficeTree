'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Branch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Для связи с самими собой(иерархия)
      Branch.belongsTo(models.Branch,{as:'parent',foreignKey:'parentId'});
      Branch.hasMany(models.Branch,{as:'childrend',foreignKey:'parentId'});
      //Сотрудники
      Branch.hasMany(models.Employee,{foreignKey:'branchId'});
    }
  }
  Branch.init({
    parentId: {
      type:DataTypes.INTEGER,
      allowNull:true,
      references:{
        model:'branches',
        key:'id'
      }
    }, 
    name: {
      type:DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Branch',
    tableName: 'branches',
  });
  return Branch;
};