'use strict'

module.exports = {
  async up(queryInterface) {
    // Use raw SQL to modify the column
    await queryInterface.sequelize.query(
      'ALTER TABLE `calendars` MODIFY `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT;'
    )
  },

  async down(queryInterface) {
    // Remove AUTO_INCREMENT
    await queryInterface.sequelize.query('ALTER TABLE `calendars` MODIFY `id` INT(11) UNSIGNED NOT NULL;')
  }
}
