export const getDateRange = (startDate, endDate) => {
  const dates = []
  const current = new Date(startDate)
  const end = new Date(endDate)

  while (current < end) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }

  return dates
}

export const calculateNights = (checkin, checkout) => {
  const checkinDate = new Date(checkin)
  const checkoutDate = new Date(checkout)
  return Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24))
}
