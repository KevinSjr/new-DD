function previousDay(day) {
  const date = new Date(`${day}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() - 1)
  return date.toISOString().slice(0, 10)
}

export function streakFromDays(days, today) {
  const ordered = [...new Set(days.filter(day => day <= today))].sort()
  let run = 0
  let best = 0
  let previous = null
  for (const day of ordered) {
    run = previous === previousDay(day) ? run + 1 : 1
    best = Math.max(best, run)
    previous = day
  }
  const latest = ordered.at(-1)
  return {
    current: latest === today || latest === previousDay(today) ? run : 0,
    best,
    practicedToday: latest === today,
  }
}
