'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('conversations', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      user_by: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      user_to: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
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
      reservation_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'reservations',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      last_message_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true
      },
      conversation_type: {
        type: Sequelize.STRING(36),
        defaultValue: 'inquiry',
        allowNull: false
      },
      subject: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      last_message_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      unread_count_initiator: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      unread_count_recipient: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      is_archived_by_initiator: {
        type: Sequelize.TINYINT(1),
        defaultValue: 0
      },
      is_archived_by_recipient: {
        type: Sequelize.TINYINT(1),
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

    await queryInterface.addIndex('conversations', ['user_by', 'user_to'])
    await queryInterface.addIndex('conversations', ['property_id'])
    await queryInterface.addIndex('conversations', ['reservation_id'])
    await queryInterface.addIndex('conversations', ['last_message_at'])
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('conversations')
  }
}
