'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add token_version column to users table
    await queryInterface.addColumn('users', 'token_version', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: 'api_token'
    })
  },

  async down(queryInterface) {
    // Remove token_version column if migration is rolled back
    await queryInterface.removeColumn('users', 'token_version')
  }
}
