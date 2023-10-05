<template>
  <div class="xs-tooltip" v-on="outerEvents" ref="tooltipNode">
    <div class="xs-tooltip__trigger" ref="triggerNode" v-on="events">
      <slot />
    </div>
    <Transition :name="transition">
      <div class="xs-tooltip__popper" ref="popperNode" v-show="isOpen">
        <slot name="content">
          {{ content }}
        </slot>
        <div id="arrow" data-popper-arrow></div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  reactive,
  ref,
  watch,
  watchEffect,
  onUnmounted,
} from 'vue'
import { type Instance, createPopper } from '@popperjs/core'
import type { TooltipEmits, TooltipProps, TooltipInstance } from './types'
import useClickOutside from '../../hooks/useClickOutside'
import { debounce } from 'lodash-es'

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'bottom',
  trigger: 'hover',
  manual: false,
  transition: 'fade',
  openDelay: 0,
  closeDelay: 0,
})
const emits = defineEmits<TooltipEmits>()

const isOpen = ref<boolean>(false)
const openDebounced = debounce(() => {
  if (!isOpen.value) {
    isOpen.value = true
    emits('visible-change', isOpen.value)
  }
}, props.openDelay)
const closeDebounced = debounce(() => {
  if (isOpen.value) {
    isOpen.value = false
    emits('visible-change', isOpen.value)
  }
}, props.closeDelay)
const open = () => {
  closeDebounced.cancel()
  openDebounced()
}
const close = () => {
  openDebounced.cancel()
  closeDebounced()
}

const toggleOpen = () => {
  if (isOpen.value) {
    close()
  } else {
    open()
  }
  emits('visible-change', isOpen.value)
}

const tooltipNode = ref<HTMLElement>()
const popperNode = ref<HTMLElement>()
const triggerNode = ref<HTMLElement>()
const popperInstance = ref<Instance | null>(null)
let events: Record<string, any> = reactive({})
let outerEvents: Record<string, any> = reactive({})
const popperOptions = computed(() => {
  return {
    placement: props.placement,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 9],
        },
      },
    ],
    ...props.popperOptions,
  }
})

useClickOutside(tooltipNode, () => {
  if (props.trigger === 'click' && isOpen.value && !props.manual) close()
})

const attachEvents = () => {
  if (props.manual) {
    events = {}
    outerEvents = {}
  } else if (props.trigger === 'hover') {
    events['mouseenter'] = open
    outerEvents['mouseleave'] = close
    events['click'] = null
  } else if (props.trigger === 'click') {
    events['click'] = toggleOpen
    events['mouseenter'] = null
    outerEvents['mouseleave'] = null
  }
}

watchEffect(attachEvents)

watch(
  isOpen,
  (newValue) => {
    if (newValue) {
      if (triggerNode.value && popperNode.value) {
        popperInstance.value?.destroy()
        popperInstance.value = createPopper(
          triggerNode.value,
          popperNode.value,
          popperOptions.value,
        )
      }
    }
  },
  { flush: 'post' },
)

onUnmounted(() => {
  popperInstance.value?.destroy()
})

defineExpose<TooltipInstance>({
  show: open,
  hide: close,
})
</script>
