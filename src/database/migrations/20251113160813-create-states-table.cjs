'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('states', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      country_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'countries',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      zone_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      name: { type: Sequelize.STRING(64), allowNull: false },
      iso_code: { type: Sequelize.STRING(7), allowNull: false },
      tax_behavior: {
        type: Sequelize.SMALLINT.UNSIGNED,
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

    await queryInterface.addIndex('states', ['zone_id'], {
      name: 'states_zone_id_foreign'
    })
    await queryInterface.addIndex('states', ['country_id'], {
      name: 'states_country_id_foreign'
    })
    await queryInterface.addIndex('states', ['name'], {
      name: 'name'
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('states')
  }
}
