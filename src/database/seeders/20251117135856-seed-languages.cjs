module.exports = {
  up: async (queryInterface) => {
    const now = new Date()
    await queryInterface.bulkInsert(
      'languages',
      [
        {
          id: 1,
          name: 'English',
          language_code: 'en',
          icon: 'icon-en',
          is_rtl: 0,
          status: 1,
          is_default: 1,
          sort: 1,
          created: now,
          modified: now
        },
        {
          id: 2,
          name: 'Italian',
          language_code: 'it',
          icon: 'icon-it',
          is_rtl: 0,
          status: 1,
          is_default: 0,
          sort: 2,
          created: now,
          modified: now
        },
        {
          id: 3,
          name: 'German',
          language_code: 'de',
          icon: 'icon-de',
          is_rtl: 0,
          status: 0,
          is_default: 0,
          sort: 3,
          created: now,
          modified: now
        },
        {
          id: 4,
          name: 'French',
          language_code: 'fr',
          icon: 'icon-fr',
          is_rtl: 0,
          status: 0,
          is_default: 0,
          sort: 4,
          created: now,
          modified: now
        },
        {
          id: 5,
          name: 'Spanish',
          language_code: 'es',
          icon: 'icon-es',
          is_rtl: 0,
          status: 0,
          is_default: 0,
          sort: 5,
          created: now,
          modified: now
        },
        {
          id: 6,
          name: 'Russian',
          language_code: 'ru',
          icon: 'icon-ru',
          is_rtl: 0,
          status: 0,
          is_default: 0,
          sort: 6,
          created: now,
          modified: now
        },
        {
          id: 7,
          name: 'Chinese',
          language_code: 'zh',
          icon: 'icon-zh',
          is_rtl: 0,
          status: 0,
          is_default: 0,
          sort: 7,
          created: now,
          modified: now
        },
        {
          id: 8,
          name: 'Portuguese',
          language_code: 'pt',
          icon: 'icon-pt',
          is_rtl: 0,
          status: 0,
          is_default: 0,
          sort: 8,
          created: now,
          modified: now
        }
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('languages', null, {})
  }
}
