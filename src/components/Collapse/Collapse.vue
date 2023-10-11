<template>
  <div class="xs-collapse">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, watch, onMounted } from 'vue'
import { type NameType, type CollapseProps, type CollapseEmits, collapseCtxKey } from './types'

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
  const _activeNames = [...activeNames.value]
  if (index > -1) {
    _activeNames.splice(index, 1)
  } else {
    if (props.accordion) {
      _activeNames[0] = item
    } else {
      _activeNames.push(item)
    }
  }
  activeNames.value = _activeNames
  emits('update:modelValue', activeNames.value)
  emits('change', activeNames.value)
}

provide(collapseCtxKey, {
  activeNames,
  handleItemClick,
})
</script>
