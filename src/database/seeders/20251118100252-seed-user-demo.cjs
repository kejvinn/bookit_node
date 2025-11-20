'use strict'

const crypto = require('crypto')
const { User } = require('../../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const adminPassword = crypto.randomBytes(6).toString('hex')
    const oltiPassword = crypto.randomBytes(6).toString('hex')
    const whateverPassword = crypto.randomBytes(6).toString('hex')

    const adminHashed = await User.hashPassword(adminPassword)
    const oltiHashed = await User.hashPassword(oltiPassword)
    const whateverHashed = await User.hashPassword(whateverPassword)
    ;(await queryInterface.bulkInsert('users', [
      {
        name: 'Admin',
        surname: 'Admin',
        email: 'olti.hamamxhiu@atisgroup.co',
        username: 'admin',
        password: adminHashed,
        activation_date: new Date(),
        status: 1,
        role: 'admin',
        is_host: 0,
        is_banned: 0,
        token_version: 0,
        created: new Date(),
        modified: new Date()
      },
      {
        name: 'Olti',
        surname: 'Hamamxhiu',
        email: 'oltihamamxhiu4@gmail.com',
        username: 'telo',
        password: oltiHashed,
        role: 'user',
        status: 1,
        activation_date: new Date(),
        is_host: 1,
        is_banned: 0,
        token_version: 0,
        created: new Date(),
        modified: new Date()
      },
      {
        name: 'Whatever',
        surname: 'Whatever',
        email: 'olti.hamamxhiu@fti.edu.al',
        username: 'whatever',
        password: whateverHashed,
        activation_date: new Date(),
        status: 1,
        role: 'user',
        is_host: 0,
        is_banned: 0,
        token_version: 0,
        created: new Date(),
        modified: new Date()
      }
    ]),
      await queryInterface.bulkInsert('user_profiles', [
        {
          user_id: 1,
          banner: 0,
          deleted: 0,
          created: new Date(),
          modified: new Date()
        },
        {
          user_id: 2,
          banner: 0,
          deleted: 0,
          created: new Date(),
          modified: new Date()
        },
        {
          user_id: 3,
          banner: 0,
          deleted: 0,
          created: new Date(),
          modified: new Date()
        }
      ]))
    // Log them nicely
    console.log('\n================= GENERATED PASSWORDS =================')
    console.log('Admin password:     ', adminPassword)
    console.log('Olti password:      ', oltiPassword)
    console.log('Whatever password:  ', whateverPassword)
    console.log('=====================================================\n')
  },

  async down(queryInterface) {
    return (queryInterface.bulkDelete('users', null, {}), queryInterface.bulkDelete('user_profiles', null, {}))
  }
}
