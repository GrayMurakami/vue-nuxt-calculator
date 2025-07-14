<script setup>
import { computed } from 'vue'
const props = defineProps(['label'])

const blue   = new Set(['+', '-', '×', '÷', '=']) // все дефисы — только обычные!
const orange = new Set(['C', '⌫', '√', '+/-', '.']) // только '+/-'

const classes = computed(() =>
  blue.has(props.label)   ? 'bg-blue'   :
  orange.has(props.label) ? 'bg-orange' : ''
)
</script>

<template>
  <button class="btn" :class="classes" @click="$emit('click', props.label)">
    {{ label }}
  </button>
</template>

<style scoped lang="scss">
.btn {
  color: aliceblue;
  width: 50px;
  height: 50px;
  background: rgba(128, 128, 128, 0.534);
  border-radius: 50%;
  text-align: center;
  line-height: 50px;
  font-size: 1.5rem;
  font-weight: bold;
  box-shadow: 1px 1px 1px #7b0f1d;
  cursor: pointer;
  user-select: none;
  transition: box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    color: #7b0f1d;
    box-shadow: 0 0 10px 2px rgba(123, 15, 29, 0.8);
    transform: scale(1.1);
  }
  &:active {
    filter: brightness(200%);
  }
}
.bg-blue {
  background: blue;
  box-shadow: 1px 1px 1px rgb(0, 234, 255);
  &:active {
    background: rgb(0, 234, 255);
  }
  &:hover {
    box-shadow: 0 0 10px 2px rgba(0, 234, 255, 0.8);
  }
}
.bg-orange {
  background: orange;
  box-shadow: 1px 1px 1px yellow;
  &:hover {
    box-shadow: 0 0 10px 2px rgba(255, 165, 0, 0.8);
  }
}
</style>