export interface InputProps {
  modelValue: string
  type?: string
  size?: 'large' | 'small'
  disabled?: boolean
  clearable?: boolean
  placeholder?: string
  readonly?: boolean
  autocomplete?: string
  autofocus?: boolean
  form?: string
  showPassword?: boolean
}

export type InputEmits = {
  'update:modelValue': [value: string]
  input: [value: string]
  change: [value: string]
  focus: [value: FocusEvent]
  blur: [value: FocusEvent]
  clear: []
}

export interface InputInstance {
  ref: HTMLElement | HTMLTextAreaElement
}
