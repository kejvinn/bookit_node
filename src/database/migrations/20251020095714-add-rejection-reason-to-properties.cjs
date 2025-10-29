'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('properties', 'rejection_reason', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      after: 'is_approved'
    })
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('properties', 'rejection_reason')
  }
}
