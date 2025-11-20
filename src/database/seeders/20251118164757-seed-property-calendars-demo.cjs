'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('calendars', [
      {
        property_id: 1,
        calendar_data: JSON.stringify({
          blocked_dates: ['2025-12-23', '2025-12-24', '2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28'],
          updated_at: new Date()
        }),
        created: new Date(),
        modified: new Date()
      }
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('calendars', null, {})
  }
}
