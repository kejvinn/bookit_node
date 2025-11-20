'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    ;(await queryInterface.bulkInsert('characteristics_properties', [
      {
        property_id: 1,
        characteristic_id: 10,
        created: new Date(),
        modified: new Date()
      },
      {
        property_id: 1,
        characteristic_id: 25,
        created: new Date(),
        modified: new Date()
      },
      {
        property_id: 1,
        characteristic_id: 12,
        created: new Date(),
        modified: new Date()
      },
      {
        property_id: 1,
        characteristic_id: 33,
        created: new Date(),
        modified: new Date()
      }
    ]),
      await queryInterface.bulkInsert('property_translations', [
        {
          property_id: 1,
          language_id: 1,
          title: 'First Property',
          description: 'A beautiful property located in the heart of the city.',
          created: new Date(),
          modified: new Date()
        }
      ]))
  },

  async down(queryInterface) {
    return (
      queryInterface.bulkDelete('characteristics_properties', null, {}),
      queryInterface.bulkDelete('property_translations', null, {})
    )
  }
}
