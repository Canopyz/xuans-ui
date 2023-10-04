<template>
  <i
    class="xs-icon"
    :class="{
      [`xs-icon--${type}`]: true,
    }"
    :style="styles"
  >
    <font-awesome-icon v-bind="filteredProps" />
  </i>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { omit } from 'lodash-es'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { IconProps } from './types'

defineOptions({
  name: 'XsIcon',
})

const props = defineProps<IconProps>()
const filteredProps = computed(() => omit(props, ['type', 'color']))
const styles = computed(() => (props.color ? { color: props.color } : {}))
</script>
