module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'characteristics',
      [
        { id: 1, icon: '1548782916_kitchen.png', icon_class: 'fa fa-adjust' },
        { id: 2, icon: '1548783035_shampoo.png', icon_class: 'fa fa-adjust' },
        { id: 3, icon: '1548783045_heating.png', icon_class: 'fa fa-adjust' },
        { id: 4, icon: '1548783336_air_condition.png', icon_class: 'fa fa-adjust' },
        { id: 5, icon: '1548783344_washer.png', icon_class: 'fa fa-adjust' },
        { id: 6, icon: '1548783355_dryer.png', icon_class: 'fa fa-adjust' },
        { id: 7, icon: '1548783364_wireless.png', icon_class: 'fa fa-adjust' },
        { id: 8, icon: '1548783374_break.png', icon_class: 'fa fa-adjust' },
        { id: 9, icon: '1548783383_fireplace.png', icon_class: 'fa fa-adjust' },
        { id: 10, icon: '1548783392_buzzer.png', icon_class: 'fa fa-adjust' },
        { id: 11, icon: '1548783401_doorman.png', icon_class: 'fa fa-adjust' },
        { id: 12, icon: '1548783508_hangers.png', icon_class: 'fa fa-adjust' },
        { id: 13, icon: '1548783819_iron.png', icon_class: 'fa fa-adjust' },
        { id: 14, icon: '1548783840_essential.png', icon_class: 'fa fa-adjust' },
        { id: 15, icon: '1548783900_laptop_friendly.png', icon_class: 'fa fa-adjust' },
        { id: 16, icon: '1548783985_tv.png', icon_class: 'fa fa-adjust' },
        { id: 17, icon: '1548784210_crib.png', icon_class: 'fa fa-adjust' },
        { id: 18, icon: '1548784251_hight_chair.png', icon_class: 'fa fa-adjust' },
        { id: 19, icon: '1548784290_self_checkin.png', icon_class: 'fa fa-adjust' },
        { id: 20, icon: '1548784382_private_bathrom.png', icon_class: 'fa fa-adjust' },
        { id: 21, icon: '1548784476_free_parking.png', icon_class: 'fa fa-adjust' },
        { id: 22, icon: '1548784485_gym.png', icon_class: 'fa fa-adjust' },
        { id: 23, icon: '1548784603_hot_tub.png', icon_class: 'fa fa-adjust' },
        { id: 24, icon: '1548784613_pool.png', icon_class: 'fa fa-adjust' },
        { id: 25, icon: '1548784763_cablle_tv.png', icon_class: 'fa fa-adjust' },
        { id: 26, icon: '1548784775_elevator.png', icon_class: 'fa fa-adjust' },
        { id: 27, icon: '1548785002_essentials.png', icon_class: 'fa fa-adjust' },
        { id: 28, icon: '1548785098_family-icon-29.png', icon_class: 'fa fa-adjust' },
        { id: 29, icon: '1548784722_internet.png', icon_class: 'fa fa-adjust' },
        { id: 30, icon: '1548784800_pets_allowed.png', icon_class: 'fa fa-adjust' },
        { id: 31, icon: '1548784646_smoke.png', icon_class: 'fa fa-adjust' },
        { id: 32, icon: '1548784896_suitable_for_events.png', icon_class: 'fa fa-adjust' },
        { id: 33, icon: '1548784626_weel.png', icon_class: 'fa fa-adjust' }
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('characteristics', null, {})
  }
}
