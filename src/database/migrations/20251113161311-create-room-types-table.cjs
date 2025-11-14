'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('room_types', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      room_type_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true
      },
      language_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      room_type_name: {
        type: Sequelize.STRING(128),
        allowNull: false
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

    await queryInterface.addIndex('room_types', ['room_type_id'], {
      unique: true
    })
    await queryInterface.addIndex('room_types', ['language_id', 'room_type_name'], { name: 'language_id' })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('room_types')
  }
}
