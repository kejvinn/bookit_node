'use strict'

module.exports = {
  async up(queryInterface) {
    // Add composite index to seasonal_prices
    await queryInterface.addIndex('seasonal_prices', ['property_id', 'start_date', 'end_date'], {
      name: 'idx_property_dates',
      unique: false
    })

    // Add index to reservations for PayPal token
    await queryInterface.addIndex('reservations', ['paypal_token'], {
      name: 'idx_paypal_token',
      unique: false
    })
  },

  async down(queryInterface) {
    // Remove indexes if migration is rolled back
    await queryInterface.removeIndex('seasonal_prices', 'idx_property_dates')
    await queryInterface.removeIndex('reservations', 'idx_paypal_token')
  }
}
