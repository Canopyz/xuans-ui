import type { InjectionKey } from 'vue'
import type { RuleItem, ValidateError, ValidateFieldsError } from 'async-validator'

export interface FormItemProps {
  label?: string
  prop?: string
}

export type FormItemRule = RuleItem & {
  trigger?: 'blur' | 'change'
}
export type FormRules = Record<string, FormItemRule[]>

export interface FormProps {
  model: Record<string, any>
  rules: FormRules
}

export interface FormContext extends FormProps {
  addField: (field: FormItemContext) => void
  removeField: (field: FormItemContext) => void
}

export interface FormItemContext {
  validate: (trigger?: string) => Promise<any>
  prop: string
  resetField: () => void
  clearValidation: () => void
}

export interface FormValidateError {
  errors: ValidateError[] | null
  fields: ValidateFieldsError
}

export interface FormInstance {
  validate: (keys?: string[]) => Promise<any>
  clearValidations: (keys?: string[]) => void
  resetFields: (keys?: string[]) => void
}

export interface ValidateStatus {
  state: 'init' | 'success' | 'error'
  errorMsg: string
  loading: boolean
}
export interface FormItemInstance {
  validate: () => Promise<any>
  resetField: () => void
  clearValidation: () => void
  validateStatus: ValidateStatus
}

export const formContextKey: InjectionKey<FormContext> = Symbol('formContext')
export const formItemContextKey: InjectionKey<FormItemContext> = Symbol('formItemContext')
