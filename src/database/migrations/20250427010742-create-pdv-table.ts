'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pdvs', {
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
      status: {
        type: Sequelize.ENUM('active', 'canceled', 'blocked'),
        allowNull: false,
        defaultValue: 'active',
      },
      serialNumber: {
        type: Sequelize.STRING(255),
        allowNull: false,
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
    await queryInterface.dropTable('Pdv');
  },
};
