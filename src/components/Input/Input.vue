<template>
  <div
    class="xs-input"
    :class="{
      [`xs-input--${type}`]: true,
      [`xs-input--${size}`]: true,
      'is-disabled': disabled,
      'is-prepend': $slots.prepend,
      'is-append': $slots.append,
      'is-prefix': $slots.prefix,
      'is-suffix': $slots.suffix,
      'is-focus': isFocus,
    }"
    v-bind="rootAttrs"
  >
    <template v-if="type !== 'textarea'">
      <div v-if="$slots.prepend" class="xs-input__prepend">
        <slot name="prepend" />
      </div>

      <div
        class="xs-input__wrapper"
        :class="{ 'is-focus': isFocus }"
        @click="focus"
        ref="wrapperRef"
      >
        <span v-if="$slots.prefix" class="xs-input__prefix" tabindex="-1">
          <slot name="prefix" />
        </span>
        <input
          ref="inputRef"
          class="xs-input__inner"
          v-bind="inputAttrs"
          :type="computedType"
          :disabled="disabled"
          :readonly="readonly"
          :autocomplete="autocomplete"
          :placeholder="placeholder"
          :autofocus="autofocus"
          :form="form"
          :showPassword="showPassword"
          :value="modelValue"
          @change="handleInputChange"
          @focus="handleFocus"
          @blur="handleBlur"
          @input="handleInput"
        />
        <span
          v-if="$slots.suffix || showClear || passwordIconVisible"
          class="xs-input__suffix"
          tabindex="-1"
        >
          <slot name="suffix" />
          <Icon v-if="showClear" icon="circle-xmark" class="xs-input__clear" @click="handleClear" />
          <Icon
            v-if="passwordIconVisible"
            :icon="passwordVisible ? 'eye' : 'eye-slash'"
            class="xs-input__password"
            @click="togglePasswordVisibility"
          />
        </span>
      </div>

      <div v-if="$slots.append" class="xs-input__append">
        <slot name="append" />
      </div>
    </template>

    <template v-else>
      <textarea
        class="xs-textarea__wrapper"
        v-bind="inputAttrs"
        ref="inputRef"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :form="form"
        :value="props.modelValue"
        @change="handleInputChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, useAttrs, inject } from 'vue'
import type { InputProps, InputEmits } from './types'
import Icon from '../Icon/Icon.vue'
import { formItemContextKey } from '../Form/types'

defineOptions({
  name: 'XsInput',
  inheritAttrs: false,
})

const attrs = useAttrs()
const rootAttrs = computed(() => ({
  onMouseenter: attrs.onMouseenter as (e: MouseEvent) => void,
  onMouseleave: attrs.onMouseleave as (e: MouseEvent) => void,
}))
const inputAttrs = computed(() => ({
  ...attrs,
  onMouseenter: undefined,
  onMouseleave: undefined,
}))

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  autocomplete: 'off',
})
const emit = defineEmits<InputEmits>()

const formItemContext = inject(formItemContextKey)
const validate = (trigger?: string) => {
  formItemContext?.validate(trigger).catch((e: any) => {})
}

const wrapperRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const focus = async () => {
  await nextTick()
  inputRef.value?.focus()
}

const handleInputChange = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value ?? '')
  emit('change', (e.target as HTMLInputElement).value ?? '')
  validate('change')
}

const isFocus = ref(false)
const showClear = computed(() => props.clearable && props.modelValue !== '' && isFocus.value)
const handleClear = () => {
  emit('update:modelValue', '')
  emit('change', '')
  emit('input', '')
  emit('clear')
}

const passwordVisible = ref(false)
const passwordIconVisible = computed(
  () => props.type === 'password' && props.showPassword && props.modelValue !== '',
)
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const computedType = computed(() => {
  if (props.type === 'password' && props.showPassword && passwordVisible.value) {
    return 'text'
  }
  return props.type
})

const handleFocus = (e: FocusEvent) => {
  if (isFocus.value) return
  emit('focus', e)
  isFocus.value = true
}

const handleBlur = (e: FocusEvent) => {
  if (e.relatedTarget && wrapperRef.value?.contains(e.relatedTarget as Node)) {
    return
  }
  emit('blur', e as FocusEvent)
  isFocus.value = false
  validate('blur')
}

const handleInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value ?? '')
  emit('input', (e.target as HTMLInputElement).value ?? '')
  validate('change')
}

defineExpose({
  ref: inputRef,
})
</script>
