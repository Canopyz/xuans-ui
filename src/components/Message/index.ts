import { h, render, shallowReactive } from 'vue'
import type { MessageContext, MessageProps } from './types'
import Message from './Message.vue'

let seed = 1
const instances: MessageContext[] = shallowReactive([])

export const createMessage = (props: Omit<MessageProps, 'onDestroy' | 'id' | 'zIndex'>) => {
  const id = `message_${seed++}`
  const container = document.createElement('div')
  const newProps = {
    ...props,
    id,
    zIndex: 1010 + instances.length,
    onDestroy: () => {
      const index = instances.findIndex((instance) => instance.id === id)
      if (index === -1) return
      instances.splice(index, 1)
      render(null, container)
    },
  }
  const vnode = h(Message, newProps)
  render(vnode, container)

  instances.push({
    id,
    vnode,
    props: newProps,
    destroy: () => {
      vnode?.component?.exposed?.closeMessage?.()
    },
  })
  document.body.appendChild(container.firstElementChild!)

  return instances[instances.length - 1]
}

export const getLatestMessage = () => {
  return instances[instances.length - 1]
}

export const getLastBottomOffset = (id: string) => {
  const index = instances.findIndex((instance) => instance.id === id)
  if (index <= 0) return 0
  const prev = instances[index - 1]
  const prevBottomOffset = prev.vnode?.component?.exposed?.bottomOffset.value
  return prevBottomOffset || 0
}

export const closeAll = () => {
  instances.forEach((instance) => {
    instance.destroy()
  })
}
