'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'is_host', {
      type: Sequelize.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
      comment: 'Indicates if user is an active host with approved properties',
      after: 'role'
    })

    // Optional: Set is_host = 1 for existing users with approved properties
    await queryInterface.sequelize.query(`
      UPDATE users u
      SET is_host = 1
      WHERE EXISTS (
        SELECT 1 FROM properties p
        WHERE p.user_id = u.id
          AND p.is_approved = 1
          AND p.status = 1
          AND p.deleted IS NULL
      )
    `)
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'is_host')
  }
}
