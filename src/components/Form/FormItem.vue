<template>
  <div
    class="xs-form-item"
    :class="{
      'is-error': validateStatus.state === 'error',
      'is-success': validateStatus.state === 'success',
      'is-loading': validateStatus.loading,
      'is-required': isRequired,
    }"
  >
    <slot name="label" :label="label">
      <label class="xs-form-item__label" :for="label">{{ label }}</label>
    </slot>
    <div class="xs-form-item__content">
      <slot :validate="validate" />
      <div class="xs-form-item__error-msg" v-if="validateStatus.state === 'error'">
        {{ validateStatus.errorMsg }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, provide, reactive } from 'vue'
import Schema from 'async-validator'
import {
  formItemContextKey,
  formContextKey,
  type FormItemProps,
  type FormValidateError,
  type FormItemContext,
  type ValidateStatus,
  type FormItemInstance,
} from './types'
import { isNil } from 'lodash-es'

defineOptions({
  name: 'XsFormItem',
})

const props = defineProps<FormItemProps>()
const formContext = inject(formContextKey)

const isPropExist = computed(
  () => formContext?.model && props.prop && !isNil(formContext.model[props.prop]),
)

const label = computed(() => props.label ?? props.prop ?? '')
const rules = computed(() => (isPropExist.value ? formContext?.rules?.[props.prop!] ?? [] : []))
const innerValue = computed(() =>
  isPropExist.value ? formContext?.model?.[props.prop!] ?? '' : '',
)
const isRequired = computed(() => rules.value.some((rule) => rule.required))

const validateStatus = reactive<ValidateStatus>({
  state: 'init',
  errorMsg: '',
  loading: false,
})

const getTriggeredRules = (trigger?: string) =>
  rules.value.filter((rule) => {
    if (!rule.trigger || !trigger) return true
    return rule.trigger === trigger
  })

const validate = async (trigger?: string) => {
  const name = props.prop
  if (!name) return true

  const triggeredRules = getTriggeredRules(trigger)
  if (!triggeredRules.length) return true

  const validator = new Schema({ [name]: triggeredRules })
  validateStatus.loading = true
  return validator
    .validate({ [name]: innerValue.value })
    .then(() => {
      validateStatus.state = 'success'
    })
    .catch((e: FormValidateError) => {
      validateStatus.state = 'error'
      validateStatus.errorMsg = e.errors?.[0].message ?? ''
      return Promise.reject(e)
    })
    .finally(() => {
      validateStatus.loading = false
    })
}

const clearValidation = () => {
  validateStatus.state = 'init'
  validateStatus.errorMsg = ''
  validateStatus.loading = false
}

let initialValue: unknown
const resetField = () => {
  clearValidation()
  const model = formContext?.model
  if (isPropExist.value) {
    model![props.prop!] = initialValue
  }
}

const context: FormItemContext = {
  validate,
  prop: props.prop ?? '',
  clearValidation,
  resetField,
}
provide(formItemContextKey, context)

onMounted(() => {
  if (props.prop) {
    formContext?.addField(context)
    initialValue = innerValue.value
  }
})
onBeforeUnmount(() => {
  if (props.prop) {
    formContext?.removeField(context)
  }
})

defineExpose<FormItemInstance>({
  validateStatus,
  validate,
  resetField,
  clearValidation,
})
</script>
