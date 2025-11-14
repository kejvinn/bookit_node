'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('calendars', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      property_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        references: {
          model: 'properties',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      calendar_data: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
        comment: 'JSON: blocked_dates, custom_pricing, etc. (stored as text blob)'
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable('calendars')
  }
}
