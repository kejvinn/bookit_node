'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add country_id column
    await queryInterface.addColumn('properties', 'country_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      after: 'country'
    })

    // Add state_id column
    await queryInterface.addColumn('properties', 'state_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      after: 'state_province'
    })

    // Add index on country_id
    await queryInterface.addIndex('properties', ['country_id'], {
      name: 'idx_property_country',
      using: 'BTREE'
    })

    // Add index on state_id
    await queryInterface.addIndex('properties', ['state_id'], {
      name: 'idx_property_state',
      using: 'BTREE'
    })

    // Add composite index on property_translations
    await queryInterface.addIndex('property_translations', ['property_id', 'language_id'], {
      name: 'idx_property_translation_lang',
      using: 'BTREE'
    })
  },

  async down(queryInterface) {
    // Remove indexes first (always remove indexes before columns)
    await queryInterface.removeIndex('properties', 'idx_property_country')
    await queryInterface.removeIndex('properties', 'idx_property_state')
    await queryInterface.removeIndex('property_translations', 'idx_property_translation_lang')

    // Remove columns
    await queryInterface.removeColumn('properties', 'state_id')
    await queryInterface.removeColumn('properties', 'country_id')
  }
}
