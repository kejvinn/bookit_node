module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'characteristic_translations',
      [
        { id: 1, characteristic_id: 4, language_id: 1, characteristic_name: 'Air conditioning' },
        { id: 2, characteristic_id: 4, language_id: 2, characteristic_name: 'Air conditioning' },

        { id: 3, characteristic_id: 8, language_id: 1, characteristic_name: 'Breakfast' },
        { id: 4, characteristic_id: 8, language_id: 2, characteristic_name: 'Breakfast' },

        { id: 5, characteristic_id: 10, language_id: 1, characteristic_name: 'Buzzer/wireless intercom' },
        { id: 6, characteristic_id: 10, language_id: 2, characteristic_name: 'Buzzer/wireless intercom' },

        { id: 7, characteristic_id: 25, language_id: 1, characteristic_name: 'Cable TV' },
        { id: 8, characteristic_id: 25, language_id: 2, characteristic_name: 'Cable TV' },

        { id: 9, characteristic_id: 17, language_id: 1, characteristic_name: 'Crib' },
        { id: 10, characteristic_id: 17, language_id: 2, characteristic_name: 'Crib' },

        { id: 11, characteristic_id: 11, language_id: 1, characteristic_name: 'Doorman' },
        { id: 12, characteristic_id: 11, language_id: 2, characteristic_name: 'Doorman' },

        { id: 13, characteristic_id: 6, language_id: 1, characteristic_name: 'Dryer' },
        { id: 14, characteristic_id: 6, language_id: 2, characteristic_name: 'Dryer' },

        { id: 15, characteristic_id: 26, language_id: 1, characteristic_name: 'Elevator in Building' },
        { id: 16, characteristic_id: 26, language_id: 2, characteristic_name: 'Elevator in Building' },

        { id: 17, characteristic_id: 27, language_id: 1, characteristic_name: 'Essentials' },
        { id: 18, characteristic_id: 27, language_id: 2, characteristic_name: 'Essentials' },

        { id: 19, characteristic_id: 28, language_id: 1, characteristic_name: 'Family/Kid Friendly' },
        { id: 20, characteristic_id: 28, language_id: 2, characteristic_name: 'Family/Kid Friendly' },

        { id: 21, characteristic_id: 21, language_id: 1, characteristic_name: 'Free parking on premises' },
        { id: 22, characteristic_id: 21, language_id: 2, characteristic_name: 'Free parking on premises' },

        { id: 23, characteristic_id: 22, language_id: 1, characteristic_name: 'Gym' },
        { id: 24, characteristic_id: 22, language_id: 2, characteristic_name: 'Gym' },

        { id: 25, characteristic_id: 12, language_id: 1, characteristic_name: 'Hangers' },
        { id: 26, characteristic_id: 12, language_id: 2, characteristic_name: 'Hangers' },

        { id: 27, characteristic_id: 3, language_id: 1, characteristic_name: 'Heating' },
        { id: 28, characteristic_id: 3, language_id: 2, characteristic_name: 'Heating' },

        { id: 29, characteristic_id: 18, language_id: 1, characteristic_name: 'High chair' },
        { id: 30, characteristic_id: 18, language_id: 2, characteristic_name: 'High chair' },

        { id: 31, characteristic_id: 23, language_id: 1, characteristic_name: 'Hot tub' },
        { id: 32, characteristic_id: 23, language_id: 2, characteristic_name: 'Hot tub' },

        { id: 33, characteristic_id: 9, language_id: 1, characteristic_name: 'Indoor fireplace' },
        { id: 34, characteristic_id: 9, language_id: 2, characteristic_name: 'Indoor fireplace' },

        { id: 35, characteristic_id: 29, language_id: 1, characteristic_name: 'Internet' },
        { id: 36, characteristic_id: 29, language_id: 2, characteristic_name: 'Internet' },

        { id: 37, characteristic_id: 13, language_id: 1, characteristic_name: 'Iron' },
        { id: 38, characteristic_id: 13, language_id: 2, characteristic_name: 'Iron' },

        { id: 39, characteristic_id: 1, language_id: 1, characteristic_name: 'Kitchen' },
        { id: 40, characteristic_id: 1, language_id: 2, characteristic_name: 'Kitchen' },

        { id: 41, characteristic_id: 15, language_id: 1, characteristic_name: 'Laptop friendly work-space' },
        { id: 42, characteristic_id: 15, language_id: 2, characteristic_name: 'Laptop friendly work-space' },

        { id: 43, characteristic_id: 30, language_id: 1, characteristic_name: 'Pets Allowed' },
        { id: 44, characteristic_id: 30, language_id: 2, characteristic_name: 'Pets Allowed' },

        { id: 45, characteristic_id: 24, language_id: 1, characteristic_name: 'Pool' },
        { id: 46, characteristic_id: 24, language_id: 2, characteristic_name: 'Pool' },

        { id: 47, characteristic_id: 20, language_id: 1, characteristic_name: 'Private bathroom' },
        { id: 48, characteristic_id: 20, language_id: 2, characteristic_name: 'Private bathroom' },

        { id: 49, characteristic_id: 19, language_id: 1, characteristic_name: 'Self check-in' },
        { id: 50, characteristic_id: 19, language_id: 2, characteristic_name: 'Self check-in' },

        { id: 51, characteristic_id: 2, language_id: 1, characteristic_name: 'Shampoo' },
        { id: 52, characteristic_id: 2, language_id: 2, characteristic_name: 'Shampoo' },

        { id: 53, characteristic_id: 31, language_id: 1, characteristic_name: 'Smoking Allowed' },
        { id: 54, characteristic_id: 31, language_id: 2, characteristic_name: 'Smoking Allowed' },

        { id: 55, characteristic_id: 32, language_id: 1, characteristic_name: 'Suitable for Events' },
        { id: 56, characteristic_id: 32, language_id: 2, characteristic_name: 'Suitable for Events' },

        { id: 57, characteristic_id: 16, language_id: 1, characteristic_name: 'TV' },
        { id: 58, characteristic_id: 16, language_id: 2, characteristic_name: 'TV' },

        { id: 59, characteristic_id: 5, language_id: 1, characteristic_name: 'Washer' },
        { id: 60, characteristic_id: 5, language_id: 2, characteristic_name: 'Washer' },

        { id: 61, characteristic_id: 33, language_id: 1, characteristic_name: 'Wheelchair Accessible' },
        { id: 62, characteristic_id: 33, language_id: 2, characteristic_name: 'Wheelchair Accessible' },

        { id: 63, characteristic_id: 7, language_id: 1, characteristic_name: 'Wifi' },
        { id: 64, characteristic_id: 7, language_id: 2, characteristic_name: 'Wifi' }
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('characteristic_translations', null, {})
  }
}
