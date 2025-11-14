'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('properties', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      address: { type: Sequelize.STRING(255), allowNull: true },
      latitude: { type: Sequelize.FLOAT(18, 16), allowNull: true },
      longitude: { type: Sequelize.FLOAT(18, 15), allowNull: true },
      country: { type: Sequelize.STRING(60), allowNull: true },
      country_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'countries', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      city: { type: Sequelize.STRING(160), allowNull: true },
      locality: { type: Sequelize.STRING(80), allowNull: true },
      district: { type: Sequelize.STRING(80), allowNull: true },
      state_province: { type: Sequelize.STRING(80), allowNull: true },
      state_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'states', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      zip_code: { type: Sequelize.STRING(10), allowNull: true },
      slug: { type: Sequelize.STRING(255), allowNull: true },
      thumbnail: { type: Sequelize.STRING(255), allowNull: true },
      capacity: { type: Sequelize.INTEGER, allowNull: true },
      bathroom_number: { type: Sequelize.FLOAT, allowNull: true },
      bedroom_number: { type: Sequelize.INTEGER, allowNull: true },
      bed_number: { type: Sequelize.INTEGER, allowNull: true },
      garages: { type: Sequelize.TINYINT(4), allowNull: true },
      construction_year: { type: Sequelize.STRING(15), allowNull: true },
      surface_area: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 10
      },
      contract_type: {
        type: Sequelize.STRING(15),
        allowNull: true,
        defaultValue: 'rent'
      },
      minimum_days: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        defaultValue: 1
      },
      maximum_days: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        defaultValue: 365
      },
      availability_type: {
        type: Sequelize.STRING(15),
        allowNull: true,
        defaultValue: 'always'
      },
      available_from: { type: Sequelize.STRING(31), allowNull: true },
      available_to: { type: Sequelize.STRING(31), allowNull: true },
      checkin_time: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: '17'
      },
      checkout_time: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: '10'
      },
      video_url: { type: Sequelize.STRING(255), allowNull: true },
      allow_instant_booking: {
        type: Sequelize.TINYINT(1),
        allowNull: true,
        defaultValue: 1
      },
      price: { type: Sequelize.FLOAT, allowNull: true },
      weekly_price: { type: Sequelize.FLOAT, allowNull: true },
      monthly_price: { type: Sequelize.FLOAT, allowNull: true },
      currency_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true },
      room_type_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'room_types', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      accommodation_type_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'accommodation_types', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      cancellation_policy_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true },
      security_deposit: { type: Sequelize.FLOAT, allowNull: true },
      unicode: { type: Sequelize.STRING(64), allowNull: true },
      status: {
        type: Sequelize.TINYINT(1),
        allowNull: true,
        defaultValue: 0
      },
      sort: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      hits: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: 1
      },
      is_approved: {
        type: Sequelize.TINYINT(1),
        allowNull: true,
        defaultValue: 0
      },
      rejection_reason: { type: Sequelize.TEXT, allowNull: true },
      is_featured: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 0
      },
      is_completed: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 0
      },
      delete_reason: { type: Sequelize.TEXT('medium'), allowNull: true },
      deleted: { type: Sequelize.DATE, allowNull: true },
      created: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      modified: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })

    await queryInterface.addIndex('properties', ['user_id'], { name: 'user_id' })
    await queryInterface.addIndex('properties', ['currency_id'], { name: 'currency_id' })
    await queryInterface.addIndex('properties', ['room_type_id'], { name: 'room_type_id' })
    await queryInterface.addIndex('properties', ['accommodation_type_id'], { name: 'accommodation_type_id' })
    await queryInterface.addIndex('properties', ['cancellation_policy_id'], { name: 'cancellation_policy_id' })
    await queryInterface.addIndex('properties', ['country_id'], { name: 'idx_property_country' })
    await queryInterface.addIndex('properties', ['state_id'], { name: 'idx_property_state' })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('properties')
  }
}
