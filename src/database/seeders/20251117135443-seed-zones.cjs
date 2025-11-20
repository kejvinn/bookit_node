module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'zones',
      [
        { id: 1, name: 'Europe', status: 1 },
        { id: 2, name: 'North America', status: 1 },
        { id: 3, name: 'Asia', status: 1 },
        { id: 4, name: 'Africa', status: 1 },
        { id: 5, name: 'Oceania', status: 1 },
        { id: 6, name: 'South America', status: 1 },
        { id: 7, name: 'Europe (non-EU)', status: 1 },
        { id: 8, name: 'Central America/Antilla', status: 1 }
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('zones', null, {})
  }
}
