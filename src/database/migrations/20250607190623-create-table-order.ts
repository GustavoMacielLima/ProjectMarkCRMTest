'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
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
      paymentMethod: {
        type: Sequelize.ENUM('pix', 'debit', 'credit'),
        allowNull: false,
        defaultValue: 'pix',
      },
      installment: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      creditFlag: {
        type: Sequelize.ENUM('master', 'visa', 'elo', 'american'),
        allowNull: true,
        defaultValue: null,
      },
      contractId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Contracts', // Nome da tabela referenciada
          key: 'id', // Coluna referenciada
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
      completedAt: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('Orders');
  },
};
