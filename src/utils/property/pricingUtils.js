/* Calculate weekly and monthly prices based on discounts */

export const pricingUtils = {
  calculateWeeklyPrice(nightlyPrice, weeklyDiscount = 0) {
    const baseWeekly = nightlyPrice * 7
    const discount = weeklyDiscount / 100
    return Math.round(baseWeekly * (1 - discount) * 100) / 100
  },

  calculateMonthlyPrice(nightlyPrice, monthlyDiscount = 0) {
    const baseMonthly = nightlyPrice * 30
    const discount = monthlyDiscount / 100
    return Math.round(baseMonthly * (1 - discount) * 100) / 100
  },

  getWeeklyDiscountPercent(nightly, weekly) {
    if (!nightly || !weekly) return 0
    const base = nightly * 7
    const discount = ((base - weekly) / base) * 100
    return Math.round(discount * 100) / 100
  },

  getMonthlyDiscountPercent(nightly, monthly) {
    if (!nightly || !monthly) return 0
    const base = nightly * 30
    const discount = ((base - monthly) / base) * 100
    return Math.round(discount * 100) / 100
  }
}
