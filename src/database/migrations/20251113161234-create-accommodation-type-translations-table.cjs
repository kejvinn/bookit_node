'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('accommodation_type_translations', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      accommodation_type_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'accommodation_types',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    await queryInterface.addIndex('accommodation_type_translations', ['language_id', 'accommodation_type_name'], {
      name: 'language_id'
    })

    await queryInterface.addIndex('accommodation_type_translations', ['accommodation_type_id'], {
      name: 'accommodation_type_id'
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('accommodation_type_translations')
  }
}
