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
      'is-loading': loading,
    }"
    :disabled="disabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
  >
    <Icon icon="spinner" spin v-if="loading" />
    <Icon :icon="icon" v-if="icon" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ButtonProps } from './types'
import Icon from '../Icon/Icon.vue'

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
