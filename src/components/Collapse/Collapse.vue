<template>
  <div class="xs-collapse">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, watch, onMounted } from 'vue'
import {
  type NameType,
  type CollapseProps,
  type CollapseEmits,
  collapseCtxKey,
} from './types'

defineOptions({
  name: 'XsCollapse',
})

onMounted(() => {
  checkAccordion()
})

const props = defineProps<CollapseProps>()
const emits = defineEmits<CollapseEmits>()

const activeNames = ref<NameType[]>(props.modelValue)

watch(
  () => props.modelValue,
  () => {
    activeNames.value = props.modelValue
    checkAccordion()
  },
)

const checkAccordion = () => {
  if (props.accordion && activeNames.value.length > 1) {
    alert('accordion mode should only have at most one active item')
    activeNames.value.splice(0, activeNames.value.length - 1)
  }
}

const handleItemClick = (item: NameType) => {
  const index = activeNames.value.indexOf(item)
  if (index > -1) {
    activeNames.value.splice(index, 1)
  } else {
    if (props.accordion) {
      activeNames.value[0] = item
    } else {
      activeNames.value.push(item)
    }
  }
  emits('update:modelValue', activeNames.value)
  emits('change', activeNames.value)
}

provide(collapseCtxKey, {
  activeNames,
  handleItemClick,
})
</script>
