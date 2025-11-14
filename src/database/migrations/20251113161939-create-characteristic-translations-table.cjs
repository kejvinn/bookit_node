'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('characteristic_translations', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      characteristic_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'characteristics',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      language_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      characteristic_name: {
        type: Sequelize.STRING(160),
        allowNull: true
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

    await queryInterface.addIndex('characteristic_translations', ['language_id'], {
      name: 'language_id'
    })
    await queryInterface.addIndex('characteristic_translations', ['characteristic_name'], {
      name: 'characteristic_name'
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('characteristic_translations')
  }
}
