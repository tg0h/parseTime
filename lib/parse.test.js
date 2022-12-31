import test from 'ava'
import { parse } from './parse.js'
import * as sinon from 'sinon'

function getTodaysDate({ year, month, date, hours, minutes, seconds, ms } = {}) {
  const now = new Date()
  const d = new Date()
  d.setYear(year ?? now.getFullYear())
  d.setMonth(month ? month - 1 : now.getMonth())
  d.setDate(date ?? now.getDate())
  d.setHours(hours ?? now.getHours())
  d.setMinutes(minutes ?? now.getMinutes())
  d.setSeconds(seconds ?? now.getSeconds())
  d.setMilliseconds(ms ?? now.getMilliseconds())
  return d.getTime()
}

test.before((t) => {
  // the month index begins with 0
  const fakeNow = new Date(2022, 11, 31, 13, 10).getTime()
  sinon.useFakeTimers(fakeNow)
  t.context.now = fakeNow

  // const clock = sinon.useFakeTimers(new Date(2022, 12, 31, 13, 10).getTime())

  // new Date() //=> return the fake Date 'Sat Nov 01 2016 00:00:00'
  // clock.restore()
  // new Date() //=> will return the real time again (now)
})

test("900 returns today's date at 9am in epoch ms", (t) => {
  const epochMs = parse('900')
  const expectedEpochMs = getTodaysDate({ hours: 9, minutes: 0, seconds: 0, ms: 0 })
  t.is(epochMs, expectedEpochMs)
})

test("1423 returns today's date at 1423H in epoch ms", (t) => {
  const epochMs = parse('1423')
  const expectedEpochMs = getTodaysDate({ hours: 14, minutes: 23, seconds: 0, ms: 0 })
  t.is(epochMs, expectedEpochMs)
})

test('1,1423 returns the 1st of this month at 1423', (t) => {
  const epochMs = parse('1,1423')
  const expectedEpochMs = getTodaysDate({ date: 1, hours: 14, minutes: 23, seconds: 0, ms: 0 })
  t.is(epochMs, expectedEpochMs)
})

test('19,900 returns the 19th of this month at 9am', (t) => {
  const epochMs = parse('19,900')
  const expectedEpochMs = getTodaysDate({ date: 19, hours: 9, minutes: 0, seconds: 0, ms: 0 })
  t.is(epochMs, expectedEpochMs)
})

test('19,1423 returns the 19th of this month at 1423', (t) => {
  const epochMs = parse('19,1423')
  const expectedEpochMs = getTodaysDate({ date: 19, hours: 14, minutes: 23, seconds: 0, ms: 0 })
  t.is(epochMs, expectedEpochMs)
})

test('1908,1423 returns the 19th of august this year at 1423', (t) => {
  const epochMs = parse('1908,1423')
  const expectedEpochMs = getTodaysDate({ month: 8, date: 19, hours: 14, minutes: 23, seconds: 0, ms: 0 })
  t.is(epochMs, expectedEpochMs)
})

//
// test.todo('19T12 returns 19th this month, 12pm')
// test.todo('19T1 returns 19th this month, 1am')
//
// test.todo('5m returns epoch time 5 minutes ago')
// test.todo('5d returns epoch time 5 days ago')
// test.todo("0cw returns this week's monday")
// test.todo("1cw returns last week's monday")
// test.todo("w2 returns this year's week 2 monday")
// test.todo('21w2 aeturns 2021 week 2 monday')
