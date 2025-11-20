// seeders/20251113100002-seed-currencies.js
module.exports = {
  up: async (queryInterface) => {
    const now = new Date()

    await queryInterface.bulkInsert(
      'currencies',
      [
        {
          id: 1,
          name: 'Euro',
          code: 'EUR',
          symbol: '&euro;',
          sign: '',
          status: 1,
          is_default: 1,
          sort: 1,
          created: now,
          modified: now
        },
        {
          id: 2,
          name: 'United States Dollars',
          code: 'USD',
          symbol: '&#36;',
          sign: '',
          status: 1,
          is_default: 0,
          sort: 2,
          created: now,
          modified: now
        },
        {
          id: 3,
          name: 'United Kingdom Pounds',
          code: 'GBP',
          symbol: '&pound;',
          sign: '',
          status: 1,
          is_default: 0,
          sort: 3,
          created: now,
          modified: now
        },
        {
          id: 4,
          name: 'Canada Dollars',
          code: 'CAD',
          symbol: '&#36;',
          sign: '',
          status: 0,
          is_default: 0,
          sort: 4,
          created: now,
          modified: now
        },
        {
          id: 5,
          name: 'Australia Dollars',
          code: 'AUD',
          symbol: '&#36;',
          sign: '',
          status: 0,
          is_default: 0,
          sort: 5,
          created: now,
          modified: now
        },
        {
          id: 6,
          name: 'Japan Yen',
          code: 'JPY',
          symbol: '&#165;',
          sign: '',
          status: 0,
          is_default: 0,
          sort: 6,
          created: now,
          modified: now
        },
        {
          id: 7,
          name: 'Switzerland Francs',
          code: 'CHF',
          symbol: '&euro;',
          sign: '',
          status: 0,
          is_default: 0,
          sort: 7,
          created: now,
          modified: now
        },
        {
          id: 8,
          name: 'Denmark Kroner',
          code: 'DKK',
          symbol: 'kr',
          sign: '',
          status: 0,
          is_default: 0,
          sort: 8,
          created: now,
          modified: now
        },
        {
          id: 9,
          name: 'Turkey Lira',
          code: 'TRY',
          symbol: '&#8378;',
          sign: '',
          status: 0,
          is_default: 0,
          sort: 9,
          created: now,
          modified: now
        },
        {
          id: 10,
          name: 'Sweden Kronor',
          code: 'SEK',
          symbol: 'kr',
          sign: '',
          status: 0,
          is_default: 0,
          sort: 10,
          created: now,
          modified: now
        },
        {
          id: 11,
          name: 'Thailand Baht',
          code: 'THB',
          symbol: '&#3647;',
          sign: '',
          status: 0,
          is_default: 0,
          sort: 11,
          created: now,
          modified: now
        },
        {
          id: 12,
          name: 'Russia Rubles',
          code: 'RUB',
          symbol: 'p',
          sign: '',
          status: 0,
          is_default: 0,
          sort: 12,
          created: now,
          modified: now
        },
        {
          id: 13,
          name: 'Brazil Reais',
          code: 'BRL',
          symbol: 'R$',
          sign: '',
          status: 0,
          is_default: 0,
          sort: 13,
          created: now,
          modified: now
        },
        {
          id: 14,
          name: 'Hong Kong Dollar',
          code: 'HKD',
          symbol: '&#36;',
          sign: '',
          status: 0,
          is_default: 0,
          sort: 14,
          created: now,
          modified: now
        },
        {
          id: 15,
          name: 'Mexico Pesos',
          code: 'MXN',
          symbol: '$',
          sign: '',
          status: 0,
          is_default: 0,
          sort: 15,
          created: now,
          modified: now
        },
        {
          id: 16,
          name: 'New Zealand Dollars',
          code: 'NZD',
          symbol: '&#36;',
          sign: '',
          status: 0,
          is_default: 0,
          sort: 16,
          created: now,
          modified: now
        },
        {
          id: 17,
          name: 'Philippines Pesos',
          code: 'PHP',
          symbol: 'P',
          sign: '',
          status: 0,
          is_default: 0,
          sort: 17,
          created: now,
          modified: now
        },
        {
          id: 18,
          name: 'Singapore Dollars',
          code: 'SGD',
          symbol: '&#36;',
          sign: '',
          status: 0,
          is_default: 0,
          sort: 18,
          created: now,
          modified: now
        }
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('currencies', null, {})
  }
}
