import type { Placement, Options } from '@popperjs/core'

export interface TooltipProps {
  content?: string
  trigger?: 'hover' | 'click'
  placement?: Placement
  manual?: boolean
  popperOptions?: Partial<Options>
  transition?: string
  openDelay?: number
  closeDelay?: number
}

export type TooltipEmits = {
  'visible-change': [value: boolean]
  'click-outside': [e: MouseEvent]
}

export interface TooltipInstance {
  show: () => void
  hide: () => void
  toggle: () => void
}
