<template>
  <Transition :name="transition" @after-leave="destroyComponent" @enter="updateHeight">
    <div
      class="xs-message"
      v-show="visible"
      role="alert"
      :class="{
        [`xs-message--${type === 'error' ? 'danger' : type}`]: true,
        'is-close': showClose,
      }"
      ref="messageRef"
      :style="style"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <div class="xs-message__content">
        <slot>
          <RenderVnode :vNode="message" v-if="message" />
        </slot>
      </div>
      <div class="xs-message__close" v-if="showClose" @click="closeMessage">
        <Icon icon="xmark" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Icon from '../Icon/Icon.vue'
import type { MessageProps } from './types'
import RenderVnode from '../Common/RenderVnode'
import { getLastBottomOffset } from './index'
import useZIndex from '../../hooks/useZIndex'
import useEventListener from '../../hooks/useEventListener'

defineOptions({
  name: 'XsMessage',
})

const props = withDefaults(defineProps<MessageProps>(), {
  duration: 3000,
  type: 'info',
  offset: 20,
  transition: 'fade-up',
})

const messageRef = ref<HTMLDivElement | null>(null)

const visible = ref(false)

const height = ref(0)
const lastOffset = computed(() => getLastBottomOffset(props.id))
const top = computed(() => lastOffset.value + props.offset)
const bottomOffset = computed(() => top.value + height.value)

const { nextZIndex } = useZIndex()
const zIndex = nextZIndex()

const style = computed(() => {
  return {
    top: `${top.value}px`,
    zindex: zIndex,
  }
})

let timer: any
const startTimer = () => {
  if (props.duration === 0) return
  timer = setTimeout(closeMessage, props.duration)
}
const clearTimer = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

const closeMessage = () => {
  visible.value = false
  clearTimer()
}

startTimer()

useEventListener(document, 'keydown', (e: Event) => {
  const event = e as KeyboardEvent
  if (event.code === 'Escape') {
    closeMessage()
  }
})

onMounted(() => {
  visible.value = true
  // updateHeight()
})

function destroyComponent() {
  props.onDestroy()
}
function updateHeight() {
  height.value = messageRef.value?.getBoundingClientRect().height ?? 0
}

defineExpose({
  bottomOffset,
  closeMessage,
})
</script>
