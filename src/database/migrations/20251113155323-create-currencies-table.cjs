// migrations/20251113100002-create-currencies-table.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('currencies', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(32),
        allowNull: true,
        comment: 'This is the name of currency'
      },
      code: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: '0',
        comment: 'Currency code (ISO like EUR, USD, etc.)'
      },
      symbol: {
        type: Sequelize.STRING(10),
        allowNull: true,
        comment: 'Holds the symbol of currency'
      },
      sign: {
        type: Sequelize.STRING(8),
        allowNull: true
      },
      status: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 1
      },
      is_default: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
        comment: 'This is the default currency for the portal'
      },
      sort: {
        type: Sequelize.INTEGER,
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

  down: async (queryInterface) => {
    await queryInterface.dropTable('currencies')
  }
}
