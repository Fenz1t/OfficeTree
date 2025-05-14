'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('branches', 'branches_parentId_fkey');

    await queryInterface.addConstraint('branches', {
      fields: ['parentId'],
      type: 'foreign key',
      name: 'branches_parentId_fkey',
      references: {
        table: 'branches',
        field: 'id',
      },
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.removeConstraint('branches', 'branches_parentId_fkey');
    
    await queryInterface.addConstraint('branches', {
      fields: ['parentId'],
      type: 'foreign key',
      name: 'branches_parentId_fkey',
      references: {
        table: 'branches',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  }
};
