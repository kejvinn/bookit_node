import { BaseRepository } from '../BaseRepository.js'
import Calendar from '../../models/property/Calendar/Calendar.js'

class CalendarRepository extends BaseRepository {
  constructor() {
    super(Calendar)
  }

  async findByPropertyId(propertyId) {
    return await Calendar.findOne({
      where: { property_id: propertyId }
    })
  }

  async upsertCalendar(propertyId, calendarData) {
    const existing = await this.findByPropertyId(propertyId)

    if (existing) {
      await existing.update({
        calendar_data: calendarData
      })
      return existing
    }

    return await Calendar.create({
      property_id: propertyId,
      calendar_data: calendarData
    })
  }

  async deleteByPropertyId(propertyId) {
    return await Calendar.destroy({
      where: { property_id: propertyId }
    })
  }
}

export default new CalendarRepository()
