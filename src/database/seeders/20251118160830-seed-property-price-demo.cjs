'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('prices', [
      {
        model_id: 1,
        model: 'Property',
        night: 55,
        week: 346.5,
        month: 1320,
        guests: 2,
        addguests: 10,
        cleaning: 0,
        security_deposit: 0,
        previous_price: 55,
        currency: 'USD',
        created: new Date(),
        modified: new Date()
      }
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('prices', null, {})
  }
}
