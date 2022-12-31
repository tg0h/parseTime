export function parse(dateString) {
  console.log(dateString)

  const d34 = /(?<hours>\d{1,2})(?<minutes>\d{2})/

  let matches
  if ((matches = dateString.match(d34))) {
    let groups = matches.groups
    let hours = parseInt(groups.hours)
    let minutes = parseInt(groups.minutes)
    return getUnixMs({ hours, minutes })
  }
}

function getUnixMs({ year, month, date, hours, minutes = 0, seconds = 0, ms = 0 } = {}) {
  let now = new Date()
  year = year ?? now.getFullYear()
  month = month ?? now.getMonth()
  date = date ?? now.getDate()
  hours = hours ?? now.getHours()
  minutes = minutes ?? now.getMinutes()
  let d = new Date(year, month, date, hours, minutes, seconds, ms)
  return d.getTime()
}
