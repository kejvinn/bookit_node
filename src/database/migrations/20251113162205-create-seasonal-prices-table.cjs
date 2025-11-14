'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    ;(await queryInterface.createTable('seasonal_prices', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      property_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'properties',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: true,
        comment: 'Special price for this date range'
      },
      start_date: { type: Sequelize.DATEONLY, allowNull: true },
      end_date: { type: Sequelize.DATEONLY, allowNull: true },
      currency: { type: Sequelize.STRING(11), allowNull: true },
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
    }),
      await queryInterface.addIndex('seasonal_prices', ['property_id'], {
        name: 'property_id_index'
      }))
    await queryInterface.addIndex('seasonal_prices', ['property_id'], {
      unique: true,
      name: 'property_id_unique'
    })
    await queryInterface.addIndex('seasonal_prices', ['property_id', 'start_date', 'end_date'], {
      name: 'idx_property_dates'
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('seasonal_prices')
  }
}
