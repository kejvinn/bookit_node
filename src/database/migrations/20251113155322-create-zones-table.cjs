// migrations/20251113100001-create-zones-table.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('zones', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      status: {
        type: Sequelize.TINYINT(1),
        defaultValue: 1,
        allowNull: false
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
    await queryInterface.dropTable('zones')
  }
}
