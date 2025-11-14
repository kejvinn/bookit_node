'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reservations', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      user_by: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        comment: 'guest',
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      user_to: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        comment: 'host',
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      property_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'properties', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      coupon_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true },
      coupon_code: { type: Sequelize.STRING(15), allowNull: true },
      discount_amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      discount_type: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: 'percentage or fixed'
      },
      tracking_code: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      checkin: { type: Sequelize.DATEONLY, allowNull: true },
      checkout: { type: Sequelize.DATEONLY, allowNull: true },
      guests: { type: Sequelize.INTEGER, allowNull: true },
      nights: { type: Sequelize.INTEGER, defaultValue: 1 },
      currency: { type: Sequelize.STRING(11), defaultValue: 'EUR' },
      type: {
        type: Sequelize.STRING(255),
        defaultValue: 'site',
        comment: 'site or mobile'
      },
      confirmation_code: { type: Sequelize.STRING(50), allowNull: true },
      reservation_status: {
        type: Sequelize.STRING(50),
        defaultValue: 'awaiting_host_approval',
        comment: 'awaiting_host_approval, confirmed, canceled, completed'
      },
      payment_method: { type: Sequelize.STRING(255), defaultValue: 'paypal' },
      payment_country: { type: Sequelize.STRING(50), defaultValue: 'N/A' },
      paypal_payment_type: { type: Sequelize.STRING(60), allowNull: true },
      paypal_token: { type: Sequelize.STRING(60), allowNull: true },
      paypal_payer_id: { type: Sequelize.STRING(60), allowNull: true },
      paypal_transaction_id: { type: Sequelize.STRING(60), allowNull: true },
      paypal_transaction_type: { type: Sequelize.STRING(60), allowNull: true },
      paypal_payer_email: { type: Sequelize.STRING(100), allowNull: true },
      paypal_payer_phonenum: { type: Sequelize.STRING(20), allowNull: true },
      price: { type: Sequelize.FLOAT, allowNull: true },
      subtotal_price: { type: Sequelize.FLOAT, allowNull: true },
      cleaning_fee: { type: Sequelize.FLOAT, allowNull: true },
      security_fee: { type: Sequelize.FLOAT, allowNull: true },
      service_fee: { type: Sequelize.FLOAT, allowNull: true },
      extra_guest_price: { type: Sequelize.FLOAT, allowNull: true },
      avarage_price: { type: Sequelize.FLOAT, allowNull: true },
      total_price: { type: Sequelize.FLOAT, allowNull: true },
      to_pay: { type: Sequelize.FLOAT, allowNull: true },
      cancellation_policy_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true },
      book_date: { type: Sequelize.DATE, allowNull: true },
      payed_date: { type: Sequelize.DATE, allowNull: true },
      cancel_date: { type: Sequelize.DATE, allowNull: true },
      is_payed: { type: Sequelize.BOOLEAN, defaultValue: false },
      is_payed_host: { type: Sequelize.BOOLEAN, defaultValue: false },
      is_payed_guest: { type: Sequelize.BOOLEAN, defaultValue: false },
      is_refunded: { type: Sequelize.BOOLEAN, defaultValue: false },
      is_canceled: { type: Sequelize.BOOLEAN, defaultValue: false },
      reason_to_cancel: { type: Sequelize.STRING(255), allowNull: true },
      created: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      modified: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deleted: { type: Sequelize.DATE, allowNull: true }
    })

    await queryInterface.addIndex('reservations', ['user_by'], { name: 'user_by' })
    await queryInterface.addIndex('reservations', ['user_to'], { name: 'user_to' })
    await queryInterface.addIndex('reservations', ['property_id'], { name: 'property_id' })
    await queryInterface.addIndex('reservations', ['cancellation_policy_id'], {
      name: 'cancellation_policy_id'
    })
    await queryInterface.addIndex('reservations', ['coupon_id'], { name: 'coupon_id' })
    await queryInterface.addIndex('reservations', ['paypal_token'], {
      name: 'idx_paypal_token'
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('reservations')
  }
}
