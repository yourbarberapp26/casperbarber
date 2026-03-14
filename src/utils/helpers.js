export const formatMoney = (v) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(v)

export const isWithinLastNDays = (dateString, days) => {
  const now = new Date()
  const date = new Date(`${dateString}T12:00:00`)
  const diff = now.getTime() - date.getTime()
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000
}