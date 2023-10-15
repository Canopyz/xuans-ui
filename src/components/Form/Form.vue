<template>
  <form class="xs-form">
    <slot />
  </form>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import type { ValidateFieldsError } from 'async-validator'
import {
  type FormProps,
  formContextKey,
  type FormItemContext,
  type FormValidateError,
  type FormInstance,
} from './types'

defineOptions({
  name: 'XsForm',
})

const props = defineProps<FormProps>()

const fields: FormItemContext[] = []

const addField = (field: FormItemContext) => {
  fields.push(field)
}
const removeField = (field: FormItemContext) => {
  const index = fields.indexOf(field)
  if (index > -1) {
    fields.splice(index, 1)
  }
}
provide(formContextKey, {
  model: props.model,
  rules: props.rules,
  addField,
  removeField,
})

const validate = async (keys: string[] = []) => {
  const filteredFields = keys.length ? fields.filter((field) => keys.includes(field.prop)) : fields

  const validationErrors: ValidateFieldsError = (
    await Promise.allSettled(filteredFields.map((field) => field.validate()))
  ).reduce((cur, res) => {
    if (res.status === 'fulfilled') {
      return cur
    }
    const err = res.reason as FormValidateError
    return {
      ...cur,
      ...err.fields,
    }
  }, {})
  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors
  }
  return true
}

const callFieldsMethod = (method: 'clearValidation' | 'validate' | 'resetField') => {
  return (keys: string[]) =>
    keys.length
      ? keys.forEach((key) => fields.find((field) => field.prop === key)?.[method]?.())
      : fields.forEach((field) => field?.[method]())
}

const resetFields = (keys: string[] = []) => callFieldsMethod('resetField')(keys)

const clearValidations = (keys: string[] = []) => callFieldsMethod('clearValidation')(keys)

defineExpose<FormInstance>({
  validate,
  resetFields,
  clearValidations,
})
</script>

<style scoped></style>
