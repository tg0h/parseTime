import { sub } from 'date-fns'

export function parse(dateInput) {
  const dateString = String(dateInput)

  const timeAgoRegex = /^(?<duration>\d+)(?<unit>s|m|h|d)$/
  const hoursMinutesRegex = /(?<hours>\d{1,2})(?<minutes>\d{2})/
  const onlyHoursAndMinutesRegex = new RegExp('^' + hoursMinutesRegex.source + '$')
  const dateMonthRegex = /(?<date>\d{1,2})(?<month>\d{2})?/
  const fullDateRegex = new RegExp(dateMonthRegex.source + ',' + hoursMinutesRegex.source)

  let matches
  if ((matches = dateString.match(timeAgoRegex))) {
    const { duration, unit } = getGroupsAgo(matches)
    return getUnixMsAgo({ duration, unit })
  } else if ((matches = dateString.match(onlyHoursAndMinutesRegex))) {
    const { hours, minutes } = getGroups(matches)
    return getUnixMs({ hours, minutes })
  } else if ((matches = dateString.match(fullDateRegex))) {
    const { month, date, hours, minutes } = getGroups(matches)
    return getUnixMs({ month, date, hours, minutes })
  }
}

function parseStringToInt(input) {
  if (typeof input === 'string') {
    // avoid returning parseInt(undefined) which gives Nan
    return parseInt(input)
  } else {
    return input
  }
}

function getGroupsAgo(matches) {
  const unit = matches.groups.unit
  const duration = matches.groups.duration

  let _unit
  switch (unit) {
    case 's':
      _unit = 'seconds'
      break
    case 'm':
      _unit = 'minutes'
      break
    case 'h':
      _unit = 'hours'
      break
  }

  // let groups = matches.groups
  // // pass undefined through instead of parseInt(undefined) which returns NaN
  // let hours = parseStringToInt(groups.hours)
  // let minutes = parseStringToInt(groups.minutes)
  // let month = parseStringToInt(groups.month)
  // let date = parseStringToInt(groups.date)
  return { duration, unit: _unit }
}

function getGroups(matches) {
  let groups = matches.groups
  // pass undefined through instead of parseInt(undefined) which returns NaN
  let hours = parseStringToInt(groups.hours)
  let minutes = parseStringToInt(groups.minutes)
  let month = parseStringToInt(groups.month)
  let date = parseStringToInt(groups.date)
  return { hours, minutes, date, month }
}

function getUnixMsAgo({ duration, unit }) {
  let now = new Date()
  // const year = now.getFullYear()
  // the date constructor accepts requires a  month index beginning with 0
  // const month = now.getMonth()
  // const date = now.getDate()
  // const hours = hours ?? now.getHours()
  // const minutes = minutes ?? now.getMinutes()
  // let d = new Date()
  // console.log('unit', unit)
  // console.log('duration', duration)
  const dateAgo = sub(now, { [unit]: duration })
  // console.log('date ago', new Date(dateAgo.getTime()))
  return dateAgo.getTime()
}
function getUnixMs({ year, month, date, hours, minutes = 0, seconds = 0, ms = 0 } = {}) {
  let now = new Date()
  year = year ?? now.getFullYear()
  // the date constructor accepts requires a  month index beginning with 0
  month = month ? month - 1 : now.getMonth()
  date = date ?? now.getDate()
  hours = hours ?? now.getHours()
  minutes = minutes ?? now.getMinutes()
  let d = new Date(year, month, date, hours, minutes, seconds, ms)
  return d.getTime()
}
