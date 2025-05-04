'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Contracts', {
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
      provider: {
        type: Sequelize.ENUM('pagseguro', 'mgpix'),
        allowNull: false,
        defaultValue: 'mgpix',
      },
      rentValue: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      debitTax: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      pixTax: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      creditTax: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      creditLowTax: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      creditHighTax: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      paymentIntervalDay: {
        type: Sequelize.ENUM('daily', 'weekly', 'biweekly', 'monthly'),
        allowNull: false,
        defaultValue: 'monthly',
      },
      version: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      isCurrent: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Companies', // Nome da tabela referenciada
          key: 'id', // Coluna referenciada
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('Contract');
  },
};
