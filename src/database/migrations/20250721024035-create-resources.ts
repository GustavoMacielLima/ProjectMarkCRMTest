'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Resources', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      topicId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Topics',
          key: 'id',
        },
      },
      url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM('video', 'article', 'pdf'),
        allowNull: false,
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
    await queryInterface.dropTable('Resources');
  },
};
