import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRollPlan, diceLabel, formatFinalTotal, formatSummary, summarize, toNotation, validateGroups } from './roll.js'

const source = (path) => readFile(new URL(path, import.meta.url), 'utf8')

test('keeps the dice configuration in place and disabled for the full roll', async () => {
  const [html, main] = await Promise.all([source('../index.html'), source('./main.js')])
  assert.match(html, /<details id="dice-config"/)
  assert.match(html, /<fieldset id="dice-config-fields"/)
  assert.match(main, /elements\.configContainer\.inert = rolling/)
  assert.match(main, /elements\.config\.disabled = rolling/)
  assert.match(main, /elements\.configContainer\.addEventListener\('click'/)
  assert.match(main, /rolling && event\.target\.closest\('summary'\)/)
  assert.match(main, /event\.preventDefault\(\)/)
  assert.doesNotMatch(main, /elements\.config\.open = false/)
})

test('caps animated rolls below three seconds', async () => {
  const main = await source('./main.js')
  assert.match(main, /const MAX_ROLL_MS = 2200/)
  assert.match(main, /performance\.now\(\) - startedAt >= MAX_ROLL_MS/)
  assert.match(main, /const RESULT_DEADLINE_MS = 2500/)
  assert.match(main, /setTimeout\(showResults, RESULT_DEADLINE_MS\)/)
})

test('keeps mobile results inside the viewport', async () => {
  const css = await source('./style.css')
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.results \{[^}]*position: fixed;[^}]*bottom: max\(18px, env\(safe-area-inset-bottom\)\);[^}]*max-height: calc\(100dvh - 36px\);[^}]*overflow: auto;/)
})

test('prepares authoritative values for every rendered die', () => {
  const values = [0, 0.5, 0.999]
  assert.deepEqual(createRollPlan([
    { id: 1, sides: 20, qty: 2 },
    { id: 2, sides: 6, qty: 1 },
  ], () => values.shift()), {
    dice: [{ sides: 20 }, { sides: 20 }, { sides: 6 }],
    results: [1, 11, 6],
    rolls: [
      { groupId: 0, value: 1 },
      { groupId: 0, value: 11 },
      { groupId: 1, value: 6 },
    ],
  })
})

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
