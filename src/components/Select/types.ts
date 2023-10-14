import type { VNode } from 'vue'

export interface SelectProps {
  modelValue: string | number
  options?: SelectOption[]
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  renderLabel?: (option: SelectOption) => VNode
  filterable?: boolean
  filterMethod?: (value: string, option: SelectOption) => boolean
  remote?: boolean
  remoteMethod?: (value: any) => Promise<SelectOption[]>
}

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export type SelectEmits = {
  change: [value: string | number]
  'update:modelValue': [value: string | number]
  'visible-change': [visible: boolean]
  clear: []
}
