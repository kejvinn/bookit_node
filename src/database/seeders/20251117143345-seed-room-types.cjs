module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'room_types',
      [
        { id: 1, room_type_id: 1, language_id: 1, room_type_name: 'Entire place' },
        { id: 2, room_type_id: 1, language_id: 2, room_type_name: 'Posto intero' },
        { id: 3, room_type_id: 2, language_id: 1, room_type_name: 'Private room' },
        { id: 4, room_type_id: 2, language_id: 2, room_type_name: 'Stanza privata' },
        { id: 5, room_type_id: 3, language_id: 1, room_type_name: 'Shared room' },
        { id: 6, room_type_id: 3, language_id: 2, room_type_name: 'Stanza condivisa' },
        { id: 7, room_type_id: 4, language_id: 1, room_type_name: 'Executive Room' },
        { id: 8, room_type_id: 4, language_id: 2, room_type_name: 'Stanza esecutiva' },
        { id: 9, room_type_id: 5, language_id: 1, room_type_name: 'Luxary Room' },
        { id: 10, room_type_id: 5, language_id: 2, room_type_name: 'Camera di lusso' },
        { id: 11, room_type_id: 6, language_id: 1, room_type_name: 'Premium Suite' },
        { id: 12, room_type_id: 6, language_id: 2, room_type_name: 'Suite Premium' }
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('room_types', null, {})
  }
}
