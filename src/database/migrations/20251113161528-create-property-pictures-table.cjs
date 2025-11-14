'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('property_pictures', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
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
      property_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'properties', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      image_path: { type: Sequelize.STRING(255), allowNull: true },
      file_hash: { type: Sequelize.STRING(64), allowNull: true },
      image_caption: { type: Sequelize.STRING(255), allowNull: true },
      sort: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      is_featured: { type: Sequelize.TINYINT(1), allowNull: true },
      status: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 1
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

    await queryInterface.addIndex('property_pictures', ['property_id'], {
      name: 'property_id'
    })
    await queryInterface.addIndex('property_pictures', ['user_id'], {
      name: 'user_id'
    })
    await queryInterface.addIndex('property_pictures', ['property_id', 'file_hash'], {
      name: 'idx_property_pictures_property_hash'
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('property_pictures')
  }
}
