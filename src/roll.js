export const ALLOWED_SIDES = [4, 6, 8, 10, 12, 20]
export const MAX_DICE = 20

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
  const groupIds = [...new Set(rolls.map(({ groupId }) => groupId))]
  return groups.map((group, index) => {
    const values = rolls.filter(({ groupId }) => groupId === groupIds[index]).map(({ value }) => Number(value))
    return { ...group, values, subtotal: values.reduce((sum, value) => sum + value, 0) }
  })
}
