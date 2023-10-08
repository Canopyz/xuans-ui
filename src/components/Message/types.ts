import type { VNode } from 'vue'

export interface MessageProps {
  message?: string | VNode
  duration?: number
  showClose?: boolean
  type?: 'success' | 'info' | 'warning' | 'error'
  onDestroy: () => void
  id: string
  offset?: number
  transition?: string
}

export interface MessageContext {
  id: string
  vnode: VNode
  props: MessageProps
  destroy: () => void
}
