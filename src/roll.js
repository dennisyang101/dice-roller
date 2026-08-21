export const ALLOWED_SIDES = [4, 6, 8, 10, 12, 20]
export const MAX_DICE = 20

export const diceLabel = (sides) => `${sides} 面骰`

export const formatSummary = ({ sides, values, subtotal }) => ({
  heading: `${values.length} x ${diceLabel(sides)}`,
  equation: `${values.join(' + ')} = ${subtotal}`,
})

export const formatFinalTotal = (summary) => {
  const subtotals = summary.map(({ subtotal }) => subtotal)
  return `${subtotals.join(' + ')} = ${subtotals.reduce((sum, subtotal) => sum + subtotal, 0)}`
}

export function validateGroups(groups) {
  if (!groups.length) return '至少需要一組骰子。'
  if (groups.some(({ sides }) => !ALLOWED_SIDES.includes(Number(sides)))) return '只支援標準 RPG 骰。'
  if (groups.some(({ qty }) => !Number.isInteger(Number(qty)) || Number(qty) < 1)) return '每組至少需要一顆骰子。'
  if (groups.reduce((sum, { qty }) => sum + Number(qty), 0) > MAX_DICE) return `一次最多投擲 ${MAX_DICE} 顆骰子。`
  return ''
}

export function toNotation(groups) {
  const error = validateGroups(groups)
  if (error) throw new Error(error)
  return groups.map(({ sides, qty }) => ({ sides: Number(sides), qty: Number(qty) }))
}

export function summarize(groups, rolls) {
  const valuesByGroup = new Map()
  rolls.forEach(({ groupId, value }) => {
    if (!valuesByGroup.has(groupId)) valuesByGroup.set(groupId, [])
    valuesByGroup.get(groupId).push(Number(value))
  })
  const values = [...valuesByGroup.values()]
  return groups.map((group, index) => {
    const groupValues = values[index] || []
    return { ...group, values: groupValues, subtotal: groupValues.reduce((sum, value) => sum + value, 0) }
  })
}
