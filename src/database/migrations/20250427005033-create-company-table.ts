'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Companies', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      stringId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      socialName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(11),
        allowNull: true,
      },
      revanueRecord: {
        type: Sequelize.STRING(14),
        allowNull: false,
        unique: true,
      },
      paymentMethod: {
        type: Sequelize.STRING, // Defina os valores explicitamente
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      mainContact: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING(255),
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
      deleteAt: {
        type: Sequelize.DATE, // Usar Sequelize.DATE para timestamps
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    // Certifique-se de usar o mesmo nome da tabela no método up
    await queryInterface.dropTable('Company');
  },
};
