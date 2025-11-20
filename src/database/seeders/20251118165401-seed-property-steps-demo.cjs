'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('property_steps', [
      {
        property_id: 1,
        basics: 1,
        description: 1,
        location: 1,
        photos: 1,
        pricing: 1,
        calendar: 1,
        created: new Date(),
        modified: new Date()
      }
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('property_steps', null, {})
  }
}
