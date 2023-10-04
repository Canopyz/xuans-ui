<template>
  <div
    class="xs-collapse-item"
    :class="{
      'is-disabled': disabled,
    }"
  >
    <div
      class="xs-collapse-item__header"
      :class="{
        'is-disabled': disabled,
      }"
      :id="`item-header-${name}`"
      @click="handleClick"
    >
      <slot name="title">
        {{ title }}
      </slot>
      <Icon
        icon="angle-right"
        class="angle"
        :class="{
          'is-active': isActive,
        }"
      />
    </div>
    <Transition v-on="transitionEvents">
      <div class="xs-collapse-item_wrapper" v-show="isActive">
        <div
          class="xs-collapse-item__content"
          :id="`item-content-${name}`"
        >
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import { collapseCtxKey, type CollapseItemProps } from './types'
import Icon from '../Icon/Icon.vue'

defineOptions({
  name: 'XsCollapseItem',
})

const props = defineProps<CollapseItemProps>()

const ctx = inject(collapseCtxKey)

const isActive = computed(
  () => ctx?.activeNames.value.includes(props.name),
)

const handleClick = () => {
  if (props.disabled) return
  ctx?.handleItemClick(props.name)
}

const transitionEvents: Record<string, (el: HTMLElement) => void> = {
  beforeEnter(el) {
    el.style.height = '0px'
    el.style.overflow = 'hidden'
    el.style.transition =
      'height var(--xs-transition-duration) ease-in-out'
  },
  enter(el) {
    el.style.height = `${el.scrollHeight}px`
  },
  afterEnter(el) {
    el.style.height = ''
    el.style.overflow = ''
    el.style.transition = ''
  },
  beforeLeave(el) {
    el.style.height = `${el.scrollHeight}px`
    el.style.overflow = 'hidden'
    el.style.transition =
      'height var(--xs-transition-duration) ease-in-out'
  },
  leave(el) {
    el.style.height = '0px'
    el.style.transition =
      'height var(--xs-transition-duration) ease-in-out'
  },
  afterLeave(el) {
    el.style.height = ''
    el.style.overflow = ''
    el.style.transition = ''
  },
}
</script>
