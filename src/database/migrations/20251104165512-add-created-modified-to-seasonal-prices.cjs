'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add 'created' column
    await queryInterface.addColumn('seasonal_prices', 'created', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'currency'
    })

    // Add 'modified' column
    await queryInterface.addColumn('seasonal_prices', 'modified', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'created'
    })
  },

  async down(queryInterface) {
    // Remove columns if migration is rolled back
    await queryInterface.removeColumn('seasonal_prices', 'modified')
    await queryInterface.removeColumn('seasonal_prices', 'created')
  }
}
