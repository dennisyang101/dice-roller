import test from 'node:test'
import assert from 'node:assert/strict'
import { diceLabel, formatFinalTotal, formatSummary, summarize, toNotation, validateGroups } from './roll.js'

test('uses standard dice names and readable result equations', () => {
  assert.equal(diceLabel(20), 'd20')
  assert.deepEqual(formatSummary({ sides: 6, values: [2, 5, 6], subtotal: 13 }), {
    heading: '3 x d6',
    equation: '2 + 5 + 6 = 13',
  })
  assert.equal(formatFinalTotal([{ subtotal: 218 }, { subtotal: 9 }]), '218 + 9 = 227')
})

test('mixed dice groups validate, map to notation, and total independently', () => {
  const groups = [{ id: 1, sides: 20, qty: 1 }, { id: 2, sides: 6, qty: 2 }]
  assert.equal(validateGroups(groups), '')
  assert.deepEqual(toNotation(groups), [{ sides: 20, qty: 1 }, { sides: 6, qty: 2 }])
  assert.deepEqual(summarize(groups, [
    { groupId: 8, value: 17 }, { groupId: 9, value: 4 }, { groupId: 9, value: 6 },
  ]).map(({ values, subtotal }) => ({ values, subtotal })), [
    { values: [17], subtotal: 17 }, { values: [4, 6], subtotal: 10 },
  ])
})

test('rejects unsupported and oversized rolls', () => {
  assert.match(validateGroups([{ id: 1, sides: 7, qty: 1 }]), /標準 RPG/)
  assert.match(validateGroups([{ id: 1, sides: 6, qty: 21 }]), /20/)
})
