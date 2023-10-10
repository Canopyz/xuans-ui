export type SwitchValueType = boolean | number | string

export interface SwitchProps {
  modelValue: SwitchValueType
  disabled?: boolean
  activeText?: string
  inactiveText?: string
  activeValue?: SwitchValueType
  inactiveValue?: SwitchValueType
  name?: string
  id?: string
  size?: 'small' | 'large'
}

export type SwitchEmits = {
  change: [value: SwitchValueType]
  'update:modelValue': [value: SwitchValueType]
}
