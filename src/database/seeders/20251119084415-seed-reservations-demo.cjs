'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const generateTrackingCode = () => {
      return `RES-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    }

    const trackingCode = generateTrackingCode()

    const generateConfirmationCode = () => {
      return Math.random().toString(36).substring(2, 12).toUpperCase()
    }
    const confirmationCode = generateConfirmationCode()

    await queryInterface.bulkInsert('reservations', [
      {
        user_by: 3,
        user_to: 2,
        property_id: 1,
        discount_amount: 0,
        tracking_code: trackingCode,
        checkin: new Date('2024-12-26'),
        checkout: new Date('2024-12-29'),
        guests: 1,
        nights: 3,
        currency: 'USD',
        type: 'site',
        confirmation_code: confirmationCode,
        reservation_status: 'pending_payment',
        payment_method: 'pending',
        payment_country: 'N/A',
        price: 55,
        subtotal_price: 165,
        cleaning_fee: 0,
        service_fee: 16.5,
        security_fee: 0,
        extra_guest_price: 0,
        avarage_price: 60.5,
        total_price: 181.5,
        to_pay: 181.5,
        book_date: new Date(),
        is_payed: 0,
        is_payed_host: 0,
        is_payed_guest: 0,
        is_refunded: 0,
        is_canceled: 0,
        created: new Date(),
        modified: new Date()
      }
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('reservations', null, {})
  }
}
