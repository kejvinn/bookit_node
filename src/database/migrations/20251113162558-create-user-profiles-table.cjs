'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_profiles', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      company: { type: Sequelize.STRING(255), allowNull: true },
      job_title: { type: Sequelize.STRING(255), allowNull: true },
      about: { type: Sequelize.TEXT('medium'), allowNull: true },
      address: { type: Sequelize.STRING(255), allowNull: true },
      zip: { type: Sequelize.STRING(50), allowNull: true },
      city: { type: Sequelize.STRING(255), allowNull: true },
      country: { type: Sequelize.STRING(255), allowNull: true },
      phone: { type: Sequelize.STRING(50), allowNull: true },
      url: { type: Sequelize.STRING(512), allowNull: true },
      linkedin: { type: Sequelize.STRING(512), allowNull: true },
      twitter: { type: Sequelize.STRING(512), allowNull: true },
      facebook: { type: Sequelize.STRING(512), allowNull: true },
      googleplus: { type: Sequelize.STRING(512), allowNull: true },
      pinterest: { type: Sequelize.STRING(512), allowNull: true },
      instagram: { type: Sequelize.STRING(512), allowNull: true },
      vimeo: { type: Sequelize.STRING(512), allowNull: true },
      youtube: { type: Sequelize.STRING(512), allowNull: true },
      hobbies: { type: Sequelize.TEXT, allowNull: true },
      knowledge: { type: Sequelize.TEXT, allowNull: true },
      references: { type: Sequelize.TEXT, allowNull: true },
      credit_card_type: { type: Sequelize.STRING(255), allowNull: true },
      credit_card_number: { type: Sequelize.STRING(255), allowNull: true },
      credit_card_expire: { type: Sequelize.STRING(12), allowNull: true },
      credit_card_security_code: { type: Sequelize.STRING(5), allowNull: true },
      card_holder: { type: Sequelize.STRING(50), allowNull: true },
      banner: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: '0'
      },
      deleted: {
        type: Sequelize.TINYINT(1),
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable('user_profiles')
  }
}
