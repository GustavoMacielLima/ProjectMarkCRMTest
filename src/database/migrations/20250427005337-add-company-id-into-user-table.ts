'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'companyId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Companies', // Nome da tabela referenciada
        key: 'id', // Coluna referenciada
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'companyId');
  },
};
