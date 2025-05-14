'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.removeConstraint('employees', 'employees_branchId_fkey');
    
    await queryInterface.addConstraint('employees', {
      fields: ['branchId'],
      type: 'foreign key',
      name: 'employees_branchId_fkey',
      references: {
        table: 'branches',
        field: 'id',
      },
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('employees', 'employees_branchId_fkey');
    
    await queryInterface.addConstraint('employees', {
      fields: ['branchId'],
      type: 'foreign key',
      name: 'employees_branchId_fkey',
      references: {
        table: 'branches',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      });
  }
};
