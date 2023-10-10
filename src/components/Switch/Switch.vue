<template>
  <div
    class="xs-switch"
    :class="{
      [`xs-switch--${size}`]: true,
      'is-disabled': disabled,
      'is-checked': checked,
    }"
    @click="switchValue"
  >
    <input
      type="checkbox"
      class="xs-switch__input"
      role="switch"
      :checked="checked"
      :name="name"
      :disabled="disabled"
      @keydown.enter="switchValue"
    />
    <div class="xs-switch__core">
      <div class="xs-switch__core-inner" v-if="activeText || inactiveText">
        <span class="xs-switch__core-inner-text">
          {{ checked ? activeText : inactiveText }}
        </span>
      </div>
      <div class="xs-switch__core-action"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SwitchProps, SwitchEmits } from './types'

defineOptions({
  name: 'XsSwitch',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SwitchProps>(), {
  activeValue: true,
  inactiveValue: false,
})
const emit = defineEmits<SwitchEmits>()

const checked = computed({
  get() {
    return props.modelValue === props.activeValue
  },
  set(val) {
    const value = val ? props.activeValue : props.inactiveValue
    emit('update:modelValue', value)
    emit('change', value)
  },
})

const switchValue = () => {
  if (!props.disabled) {
    checked.value = !checked.value
  }
}
</script>

<style scoped></style>
