'use strict'

const path = require('path')
const fs = require('fs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const thumbnailFilename = '1763456630498-163952299.jpg'

    const uploadsDir = path.resolve(__dirname, '../../uploads/properties')
    const fullPath = path.join(uploadsDir, thumbnailFilename)

    if (!fs.existsSync(fullPath)) {
      console.warn(`Expected thumbnail not found: ${fullPath}`)
    }
    await queryInterface.bulkInsert('properties', [
      {
        user_id: 2,
        address: 'Rruga Elbasanit',
        latitude: 41.3241996765,
        longitude: 19.8239994049,
        country: 'Albania',
        city: 'Tiranë',
        state_province: 'Qarku i Tiranës',
        zip_code: 1010,
        thumbnail: thumbnailFilename,
        capacity: 2,
        bathroom_number: 1,
        bedroom_number: 1,
        bed_number: 3,
        surface_area: 45,
        contract_type: 'rent',
        minimum_days: 2,
        maximum_days: 40,
        availability_type: 'always',
        checkin_time: '15:00',
        checkout_time: '12:00',
        allow_instant_booking: 1,
        price: 55,
        weekly_price: 346.5,
        monthly_price: 1320,
        room_type_id: 1,
        security_deposit: 0,
        status: 1,
        sort: 0,
        hits: 1,
        is_approved: 1,
        is_featured: 0,
        is_completed: 1,
        created: new Date(),
        modified: new Date()
      }
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('properties', null, {})
  }
}
