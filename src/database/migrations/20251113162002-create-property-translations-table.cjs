'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('property_translations', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      property_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'properties',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      language_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      title: { type: Sequelize.STRING(128), allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      location_description: { type: Sequelize.TEXT, allowNull: true },
      space: { type: Sequelize.TEXT, allowNull: true },
      access: { type: Sequelize.TEXT, allowNull: true },
      interaction: { type: Sequelize.TEXT, allowNull: true },
      notes: { type: Sequelize.TEXT, allowNull: true },
      house_rules: { type: Sequelize.TEXT, allowNull: true },
      neighborhood_overview: { type: Sequelize.TEXT, allowNull: true },
      seo_title: { type: Sequelize.STRING(128), allowNull: true },
      seo_description: { type: Sequelize.STRING(255), allowNull: true },
      seo_keywords: { type: Sequelize.STRING(255), allowNull: true },
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

    await queryInterface.addIndex('property_translations', ['property_id'], {
      name: 'property_id'
    })
    await queryInterface.addIndex('property_translations', ['language_id'], {
      name: 'language_id'
    })
    await queryInterface.addIndex('property_translations', ['title'], {
      name: 'title'
    })
    await queryInterface.addIndex('property_translations', ['property_id', 'language_id'], {
      name: 'idx_property_translation_lang'
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('property_translations')
  }
}
