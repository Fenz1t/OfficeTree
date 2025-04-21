'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branchId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'branches',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment:'Филиал сотрудника'
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull:false,
        comment:'ФИО сотрудника'
      },
      birthDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        comment: 'Дата рождения'
      },
      positionId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'positions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Должность сотрудника'
      },
      salary: {
        type: Sequelize.FLOAT,
        allowNull:false,
        comment: 'Оклад'
      },
      hireDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        comment: 'Дата приема на работу'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('employees');
  }
};