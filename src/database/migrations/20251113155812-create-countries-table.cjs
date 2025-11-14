'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('countries', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      zone_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      currency_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },
      iso_code: { type: Sequelize.STRING(3), allowNull: false },
      name: { type: Sequelize.STRING(64), allowNull: false },
      phonecode: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      numcode: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true },
      contains_states: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 0
      },
      need_identification_number: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 0
      },
      need_zip_code: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 1
      },
      zip_code_format: {
        type: Sequelize.STRING(12),
        allowNull: false,
        defaultValue: ''
      },
      display_tax_label: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 0
      },
      status: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 0
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

    await queryInterface.addIndex('countries', ['zone_id'], {
      name: 'countries_zone_id_foreign'
    })
    await queryInterface.addIndex('countries', ['iso_code'], {
      name: 'countries_iso_code'
    })
    await queryInterface.addIndex('countries', ['currency_id'], {
      name: 'countries_currency_id_foreign'
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('countries')
  }
}
