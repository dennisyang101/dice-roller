import DiceBox from '@3d-dice/dice-box'
import '@3d-dice/dice-box/dist/style.css'
import './style.css'
import { ALLOWED_SIDES, MAX_DICE, summarize, toNotation, validateGroups } from './roll.js'

const elements = {
  groups: document.querySelector('#dice-groups'),
  add: document.querySelector('#add-group'),
  roll: document.querySelector('#roll-button'),
  validation: document.querySelector('#validation'),
  empty: document.querySelector('#empty-state'),
  results: document.querySelector('#results'),
  resultGroups: document.querySelector('#result-groups'),
  total: document.querySelector('#total'),
}

let nextId = 3
let groups = [
  { id: 1, sides: 20, qty: 1 },
  { id: 2, sides: 6, qty: 2 },
]
let ready = false
let rolling = false

const diceBox = new DiceBox('#dice-box', {
  assetPath: '/assets/',
  themeColor: '#d8a938',
  scale: 6,
  gravity: 1.2,
  throwForce: 6,
  spinForce: 5,
  settleTimeout: 6000,
})

function renderGroups() {
  elements.groups.innerHTML = groups.map(({ id, sides, qty }, index) => `
    <div class="dice-row" data-id="${id}">
      <span class="row-number">${index + 1}</span>
      <label>
        <span>骰型</span>
        <select data-field="sides" aria-label="第 ${index + 1} 組骰型">
          ${ALLOWED_SIDES.map((value) => `<option value="${value}" ${value === sides ? 'selected' : ''}>d${value}</option>`).join('')}
        </select>
      </label>
      <span class="times">×</span>
      <label>
        <span>數量</span>
        <input data-field="qty" aria-label="第 ${index + 1} 組數量" type="number" min="1" max="${MAX_DICE}" inputmode="numeric" value="${qty}">
      </label>
      <button class="remove-button" data-action="remove" type="button" aria-label="移除第 ${index + 1} 組">×</button>
    </div>
  `).join('')
  updateValidation()
}

function updateValidation() {
  const error = validateGroups(groups)
  elements.validation.textContent = error
  elements.roll.disabled = !ready || rolling || Boolean(error)
  elements.add.disabled = rolling || groups.reduce((sum, group) => sum + group.qty, 0) >= MAX_DICE
}

function renderResults(summary) {
  const total = summary.reduce((sum, group) => sum + group.subtotal, 0)
  elements.total.textContent = total
  elements.resultGroups.innerHTML = summary.map(({ sides, values, subtotal }) => `
    <li>
      <span><b>${values.length}d${sides}</b>　${values.join(' + ')}</span>
      <strong>${subtotal}</strong>
    </li>
  `).join('')
  elements.results.classList.add('is-visible')
}

async function roll() {
  const error = validateGroups(groups)
  if (error || rolling) return
  rolling = true
  elements.roll.textContent = '投擲中…'
  elements.empty.hidden = true
  elements.results.classList.remove('is-visible')
  updateValidation()

  try {
    const rolls = await diceBox.roll(toNotation(groups))
    renderResults(summarize(groups, rolls))
  } catch (error) {
    elements.validation.textContent = `無法投擲：${error.message}`
  } finally {
    rolling = false
    elements.roll.textContent = '再次投擲'
    updateValidation()
  }
}

elements.groups.addEventListener('input', (event) => {
  const row = event.target.closest('.dice-row')
  const field = event.target.dataset.field
  if (!row || !field) return
  const group = groups.find(({ id }) => id === Number(row.dataset.id))
  group[field] = Number(event.target.value)
  updateValidation()
})

elements.groups.addEventListener('click', (event) => {
  const row = event.target.closest('.dice-row')
  if (!row || event.target.dataset.action !== 'remove') return
  groups = groups.filter(({ id }) => id !== Number(row.dataset.id))
  renderGroups()
})

elements.add.addEventListener('click', () => {
  groups.push({ id: nextId++, sides: 6, qty: 1 })
  renderGroups()
})

elements.roll.addEventListener('click', roll)

renderGroups()

diceBox.init().then(() => {
  ready = true
  elements.roll.textContent = '開始投擲'
  updateValidation()
}).catch((error) => {
  elements.validation.textContent = `3D 骰子載入失敗：${error.message}`
  elements.roll.textContent = '無法載入'
})
