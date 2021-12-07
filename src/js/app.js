import { add, subtract, divide, multiply, percent, opposite } from './math'

let state = {
  primary: 0,
  secondary: 0,
  editing: 'primary',
  operator: null,
  output: null,
}

const outputDisplay = document.getElementById('output')
const functions = document.querySelectorAll('button[data-function]')
const values = document.querySelectorAll('button[data-value]')

const setDisplay = text => {
  outputDisplay.innerHTML = text
}

const setOperator = operator => {
  switch (operator) {
    case 'add':
      state.operator = (a, b) => add(a, b)
      break
    case 'subtract':
      state.operator = (a, b) => subtract(a, b)
      break
    case 'divide':
      state.operator = (a, b) => divide(a, b)
      break
    case 'multiply':
      state.operator = (a, b) => multiply(a, b)
      break
    default:
      state.operator = null
      break
  }

  state.editing = 'secondary'

  // if the user continues the sum
  if (state.primary && state.secondary && state.output !== null) {
    state.primary = state.output
    state.secondary = 0
    state.editing = 'secondary'
    state.output = null
  }
}

const setValue = newVal => {
  const { editing } = state

  state[editing] === 0 ? (state[editing] = newVal) : (state[editing] += newVal)
  setDisplay(state[state.editing])
}

const setPercent = () => {
  const { editing } = state

  state[editing] > 0 ? (state[editing] = percent(state[editing])) : false
  setDisplay(state[editing])
}

const setOppositeVal = () => {
  const { editing } = state

  state[editing] = opposite(state[editing])
  setDisplay(state[editing])
}

const allClear = () => {
  state = { primary: 0, secondary: 0, editing: 'primary', operator: null, output: null }
  setValue(0)
}

const calculate = () => {
  if (!state.operator) return
  state.output = state.operator(parseFloat(state.primary), parseFloat(state.secondary))
  setDisplay(state.output)
}

// Start the app

setDisplay(state.primary)

functions.forEach(button => {
  button.addEventListener('click', () => {
    eval(button.getAttribute('data-function'))
  })
})

values.forEach(button => {
  button.addEventListener('click', () => {
    setValue(button.getAttribute('data-value'))
  })
})

// Keybindings

const keyMaps = e => {
  console.log(e.key)
  const { key } = e
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const operators = [
    { key: '+', value: 'add' },
    { key: '-', value: 'subtract' },
    { key: '/', value: 'divide' },
    { key: '*', value: 'multiply' },
  ]

  if (key === '=' || key === 'Enter') {
    calculate()
    return
  }

  if (key === '%') {
    setPercent()
    return
  }

  if (key === 'Escape') {
    allClear()
    return
  }

  if (numbers.includes(parseInt(key))) {
    setValue(key)
    return
  }

  operators.forEach(operator => {
    if (operator.key === key) {
      setOperator(operator.value)
      return
    }
  })
}

document.addEventListener('keydown', keyMaps)
