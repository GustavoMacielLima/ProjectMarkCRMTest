'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'verificationCode', {
      type: Sequelize.STRING(8),
      defaultValue: null,
      validate: {
        len: [8, 8],
      },
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'verificationCode');
  },
};
