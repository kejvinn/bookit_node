'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coupons', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        comment: 'Admin or user who created the coupon',
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      property_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        comment: 'If set, coupon only works for this property',
        references: {
          model: 'properties',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      name: {
        type: Sequelize.STRING(60),
        allowNull: false
      },
      code: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true
      },
      price_type: {
        type: Sequelize.TINYINT(2),
        allowNull: false,
        defaultValue: 1,
        comment: '1=percentage, 2=fixed'
      },
      price_value: {
        type: Sequelize.FLOAT(10, 2),
        allowNull: false
      },
      coupon_type: {
        type: Sequelize.STRING(60),
        allowNull: false,
        defaultValue: 'travel',
        comment: 'Business, travel, Promote, Advert, Birthday card etc'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      date_from: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      date_to: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      purchase_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      description: {
        type: Sequelize.STRING(120),
        allowNull: true
      },
      status: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
        comment: '0=inactive, 1=active'
      },
      currency: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      sort: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
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

    await queryInterface.addIndex('coupons', ['user_id'], { name: 'user_id' })
    await queryInterface.addIndex('coupons', ['property_id'], {
      name: 'property_id'
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('coupons')
  }
}
