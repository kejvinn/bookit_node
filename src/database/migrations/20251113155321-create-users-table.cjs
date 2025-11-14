'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: { type: Sequelize.STRING(32), allowNull: true },
      surname: { type: Sequelize.STRING(32), allowNull: true },
      email: {
        type: Sequelize.STRING(128),
        allowNull: true,
        unique: true
      },
      username: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true
      },
      password: { type: Sequelize.STRING(128), allowNull: false },
      birthday: { type: Sequelize.STRING(12), allowNull: true },
      gender: { type: Sequelize.STRING(8), allowNull: true },
      image_path: { type: Sequelize.STRING(512), allowNull: true },
      token: { type: Sequelize.STRING(255), allowNull: true },
      token_expires: { type: Sequelize.DATE, allowNull: true },
      api_token: { type: Sequelize.STRING(255), allowNull: true },
      reset_password: { type: Sequelize.STRING(255), allowNull: true },
      activation_code: { type: Sequelize.STRING(64), allowNull: true },
      activation_date: { type: Sequelize.DATE, allowNull: true },
      status: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },
      role: {
        type: Sequelize.STRING(12),
        allowNull: false,
        defaultValue: 'user'
      },
      is_host: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
        comment: 'Indicates if user is an active host with approved properties'
      },
      is_banned: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 0
      },
      parent_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true },
      deleted: { type: Sequelize.DATE, allowNull: true },
      token_version: {
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

    await queryInterface.addIndex('users', ['email'], {
      name: 'user_email'
    })
    await queryInterface.addIndex('users', ['email', 'password'], {
      name: 'user_login'
    })
    await queryInterface.addIndex('users', ['id', 'password'], {
      name: 'id_user_passwd'
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users')
  }
}
