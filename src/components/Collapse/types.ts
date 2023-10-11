import type { InjectionKey, Ref } from 'vue'

export type NameType = string | number

export interface CollapseProps {
  modelValue: NameType[]
  accordion?: boolean
}

export type CollapseEmits = {
  'update:modelValue': [values: NameType[]]
  change: [values: NameType[]]
}

export interface CollapseItemProps {
  name: string | number
  title?: string
  disabled?: boolean
}

export interface CollapseCtx {
  activeNames: Ref<NameType[]>
  handleItemClick: (name: NameType) => void
}

export const collapseCtxKey: InjectionKey<CollapseCtx> = Symbol('collapseCtxKey')
