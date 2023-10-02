<template>
  <button
    ref="button"
    class="xs-button"
    :class="{
      [`xs-button--${type}`]: true,
      [`xs-button--${size}`]: true,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-disabled': disabled,
    }"
    :disabled="disabled"
    :autofocus="autofocus"
    :type="nativeType"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { defineOptions, ref } from 'vue'
import type { ButtonProps } from './types'

withDefaults(defineProps<ButtonProps>(), {
  nativeType: 'button',
})

defineOptions({
  name: 'XsButton',
})

const button = ref<HTMLButtonElement>()

defineExpose({
  ref: button,
})
</script>

<style scoped></style>
