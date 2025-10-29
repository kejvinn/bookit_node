'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('property_pictures', 'file_hash', {
      type: Sequelize.STRING(64),
      allowNull: true,
      after: 'image_path'
    })

    await queryInterface.addIndex('property_pictures', ['property_id', 'file_hash'], {
      name: 'idx_property_pictures_property_hash'
    })
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('property_pictures', 'idx_property_pictures_property_hash')

    await queryInterface.removeColumn('property_pictures', 'file_hash')
  }
}
