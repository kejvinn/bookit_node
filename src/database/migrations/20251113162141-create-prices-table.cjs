'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('prices', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      model_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'properties',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      model: {
        type: Sequelize.STRING(32),
        allowNull: false,
        defaultValue: 'Property'
      },
      night: { type: Sequelize.DOUBLE, allowNull: true },
      week: { type: Sequelize.DOUBLE, allowNull: true },
      month: { type: Sequelize.DOUBLE, allowNull: true },
      guests: { type: Sequelize.SMALLINT, allowNull: true },
      addguests: { type: Sequelize.INTEGER, allowNull: true },
      cleaning: { type: Sequelize.INTEGER, allowNull: true },
      security_deposit: { type: Sequelize.INTEGER, allowNull: true },
      previous_price: { type: Sequelize.DOUBLE, allowNull: true },
      currency: {
        type: Sequelize.CHAR(3),
        allowNull: false,
        defaultValue: 'EUR'
      },
      created: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      modified: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })

    await queryInterface.addIndex('prices', ['model_id'], { name: 'model_id' })
    await queryInterface.addIndex('prices', ['model'], { name: 'model' })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('prices')
  }
}
