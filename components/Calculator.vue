<template>
  <div class="calc" v-tilt>
    <div class="calc-screen">
      <p class="field">{{ displayValue }}</p>
      <button @click="copyToClipboard(displayValue)" class="copy-btn" title="Copy">📋</button>
    </div>
    <div class="buttons">
      <CalcBtn
        v-for="btn in buttons"
        :key="btn.label"
        :label="btn.label"
        @click="onBtnClick"
      />
    </div>
    <b><p class="author">&copy; 2025 GraY</p></b>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onMounted, onBeforeUnmount } from 'vue'
import { useClipboard } from '@vueuse/core'
import CalcBtn from '~/components/CalcBtn.vue'


const maxLength = 7
const firstValue = ref('0')
const secondValue = ref('')
const operator = ref('')
const isSecondValueInput = ref(false)
const justCalculated = ref(false) // <-- это флаг!
const { copy: copyToClipboard } = useClipboard()

const displayValue = computed(() => {
  if (isSecondValueInput.value) {
    return secondValue.value === '' ? firstValue.value || '0' : secondValue.value
  }
  return firstValue.value || '0'
})

// --- Кнопки
const buttons = [
  { label: 'C' }, { label: '⌫' }, { label: '√' }, { label: '+' },
  { label: '7' }, { label: '8' }, { label: '9' }, { label: '-' },
  { label: '4' }, { label: '5' }, { label: '6' }, { label: '×' },
  { label: '1' }, { label: '2' }, { label: '3' }, { label: '÷' },
  { label: '+/-' }, { label: '0' }, { label: '.' }, { label: '=' }
]

// --- Обработка клика по кнопке
function onBtnClick(label) {
  if (!isNaN(Number(label))) return inputDigit(label)
  if (label === '.')         return inputDigit('.')
  if (label === '+/-')       return toggleSign()
  if (label === 'C')         return clearAll()
  if (label === '⌫')         return deleteLast()
  if (label === '√')         return handleSqrt()
  if (['+', '-', '×', '÷'].includes(label)) return setOperator(label)
  if (label === '=')         return calculateResult()
}

// --- Логика калькулятора (аналогично твоей)
function inputDigit(digit) {
  // Если только что был результат, начать новое число
  if (justCalculated.value && !isSecondValueInput.value) {
    firstValue.value = digit === '.' ? '0.' : digit
    justCalculated.value = false
    return
  }
  const target = isSecondValueInput.value ? secondValue : firstValue
  if (target.value.length >= maxLength && digit !== '.') return
  if (digit === '.' && target.value.includes('.')) return
  if (target.value === '0' && digit !== '.') target.value = digit
  else target.value += digit
  justCalculated.value = false
}

function setOperator(op) {
  if (operator.value && secondValue.value) calculateResult()
  operator.value = op
  isSecondValueInput.value = true
  justCalculated.value = false // сбрасываем!
}

function calculateResult() {
  let a = parseFloat(firstValue.value)
  let b = parseFloat(secondValue.value || firstValue.value)
  let result = 0
  switch (operator.value) {
    case '+': result = a + b; break
    case '-': result = a - b; break
    case '×': result = a * b; break
    case '÷': result = b === 0 ? 'Error' : a / b; break
    default: return
  }
  let resultStr = (result === 'Error') ? 'Error' : +parseFloat(result).toFixed(8)
  resultStr = String(resultStr)
  if (resultStr.length > maxLength) resultStr = (+resultStr).toExponential(4)
  firstValue.value = resultStr
  secondValue.value = ''
  operator.value = ''
  isSecondValueInput.value = false
  justCalculated.value = true // <<< !
}

function clearAll() {
  firstValue.value = '0'
  secondValue.value = ''
  operator.value = ''
  isSecondValueInput.value = false
  justCalculated.value = false
}

function deleteLast() {
  const target = isSecondValueInput.value ? secondValue : firstValue
  target.value = target.value.slice(0, -1) || '0'
}

function handleSqrt() {
  const target = isSecondValueInput.value ? secondValue : firstValue
  let num = parseFloat(target.value)
  if (isNaN(num) || num < 0) {
    target.value = 'Error'
    return
  }
  let sqrtVal = Math.sqrt(num).toFixed(8)
  sqrtVal = +sqrtVal
  target.value = String(sqrtVal).length > maxLength ? sqrtVal.toExponential(4) : String(sqrtVal)
}

function toggleSign() {
  const target = isSecondValueInput.value ? secondValue : firstValue
  if (target.value === '0' || target.value === '') return
  if (target.value.startsWith('-')) target.value = target.value.slice(1)
  else target.value = '-' + target.value
}

// keyboard tapping logic

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

function handleKeydown(e) {
  // Разрешённые клавиши (цифры)
  if (/^[0-9]$/.test(e.key)) {
    inputDigit(e.key)
    e.preventDefault()
    return
  }
  // Точка
  if (e.key === '.' || e.key === ',') {
    inputDigit('.')
    e.preventDefault()
    return
  }
  // Операторы
  if (['+', '-', '*', '/'].includes(e.key)) {
    let op = e.key === '*' ? '×' : (e.key === '/' ? '÷' : e.key)
    setOperator(op)
    e.preventDefault()
    return
  }
  // Enter / = (равно)
  if (e.key === 'Enter' || e.key === '=') {
    calculateResult()
    e.preventDefault()
    return
  }
  // Backspace
  if (e.key === 'Backspace') {
    deleteLast()
    e.preventDefault()
    return
  }
  // Escape (C)
  if (e.key === 'Escape') {
    clearAll()
    e.preventDefault()
    return
  }
}
</script>

<style scoped lang="scss">
.calc {
  margin: 50px auto;
  width: 300px;
  height: 500px;
  border: 2px solid #7b0f1d;
  background: black;
  border-radius: 25px;
  font-family: Arial, Helvetica, sans-serif;
  padding: 18px;
  color: aliceblue;
  box-shadow:
    1px 1px 1px #ccc,
    1px 1px 1px #c9c9c9,
    1px 1px 1px #bbb,
    1px 1px 1px #b9b9b9,
    1px 1px 1px #aaa,
    0 6px 1px rgba(0,0,0,.1),
    0 0 5px rgba(0,0,0,.1),
    0 1px 3px rgba(0,0,0,.3),
    0 3px 5px rgba(0,0,0,.2),
    0 5px 10px rgba(0,0,0,.25),
    0 10px 10px rgba(0,0,0,.2),
    0 20px 20px rgba(0,0,0,.15),
    0 1px 3px rgba(0, 0, 0, 0.1), 
    0 1px 5px rgba(0, 0, 0, 0.15),
    0 2px 10px rgba(0, 0, 0, 0.2),
    0 4px 15px rgba(0, 0, 0, 0.25),
    0 6px 20px rgba(0, 0, 0, 0.3),
    0 8px 25px rgba(0, 0, 0, 0.35),
    0 12px 30px rgba(0, 0, 0, 0.4),
    0 15px 40px rgba(0, 0, 0, 0.45),
    0 20px 50px rgba(0, 0, 0, 0.5);
}

.calc-move {
  transform: rotateX(var(--mouseY)) rotateY(var(--mouseX));
  transition: transform 0.1s ease-out;
}

.calc-screen {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 60px;
  position: relative;
}

.field {
  height: 40px;
  padding: 10px;
  display: grid;
  margin-top: 15px;
  font-size: 4rem;
  justify-items: end;
  align-items: end;
}

.copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5em;
  color: #fff;
  margin-top: 10px;
  transition: color 0.2s, transform 0.15s;
  padding: 4px;
  border-radius: 6px;
  box-shadow: 0 0 0 transparent;
  &:hover {
    color: orange;
    transform: scale(1.15) rotate(-6deg);
    background: rgba(255,255,255,0.06);
    box-shadow: 0 0 6px 0 orange;
  }
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
  justify-items: center;
  padding-top: 10px;
}

.author {
  text-align: right;
  text-shadow: 1px 1px 1px #7b0f1d;
  color: rgb(0, 234, 255);
  font-size: 22px;
  margin-top: 45px;
}
</style>
