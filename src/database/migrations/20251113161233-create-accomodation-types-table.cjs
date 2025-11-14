'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('accommodation_types', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      accommodation_type_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      language_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      accommodation_type_name: {
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

    await queryInterface.addIndex('accommodation_types', ['language_id', 'accommodation_type_name'], {
      name: 'language_id'
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('accommodation_types')
  }
}
