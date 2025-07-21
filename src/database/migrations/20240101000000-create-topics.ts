'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Topics', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      content: {
        type: Sequelize.LONGTEXT,
        allowNull: false,
      },
      version: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(11),
        allowNull: true,
      },
      parentTopicId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE, // Usar Sequelize.DATE para timestamps
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE, // Usar Sequelize.DATE para timestamps
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DATE, // Usar Sequelize.DATE para timestamps
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    // Certifique-se de usar o mesmo nome da tabela no método up
    await queryInterface.dropTable('Topics');
  },
};
