'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('reservations', 'coupon_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      after: 'property_id'
    })

    await queryInterface.addColumn('reservations', 'coupon_code', {
      type: Sequelize.STRING(15),
      allowNull: true,
      after: 'coupon_id'
    })

    await queryInterface.addColumn('reservations', 'discount_amount', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
      after: 'coupon_code'
    })

    await queryInterface.addColumn('reservations', 'discount_type', {
      type: Sequelize.STRING(20),
      allowNull: true,
      comment: 'percentage or fixed',
      after: 'discount_amount'
    })

    await queryInterface.addIndex('reservations', ['coupon_id'])
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('reservations', ['coupon_id'])
    await queryInterface.removeColumn('reservations', 'discount_type')
    await queryInterface.removeColumn('reservations', 'discount_amount')
    await queryInterface.removeColumn('reservations', 'coupon_code')
    await queryInterface.removeColumn('reservations', 'coupon_id')
  }
}
