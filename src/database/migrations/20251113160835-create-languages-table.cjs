module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('languages', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      language_code: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        unique: true
      },
      icon: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      is_rtl: {
        type: Sequelize.TINYINT(1),
        defaultValue: 0
      },
      status: {
        type: Sequelize.TINYINT(1),
        defaultValue: 1
      },
      is_default: {
        type: Sequelize.TINYINT(1),
        defaultValue: 0
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
    await queryInterface.dropTable('languages')
  }
}
