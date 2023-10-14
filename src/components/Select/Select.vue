<template>
  <div
    class="xs-select"
    :class="{
      ['is-disabled']: disabled,
    }"
    @click="toggleTooltip"
  >
    <Tooltip placement="bottom-start" manual ref="tooltipRef" :popper-options="popperOptions">
      <Input
        ref="inputRef"
        v-model="displayedLabel"
        :disabled="disabled"
        :placeholder="filterable && !isReadonly && selectedLabel ? selectedLabel : placeholder"
        :readonly="isReadonly"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
        @keydown="handleKeydown"
        @blur="handleBlur"
      >
        <template #suffix>
          <Icon
            icon="circle-xmark"
            class="xs-select__clear"
            v-if="showClearIcon"
            @mousedown.prevent="() => {}"
            @click.stop="handleClear"
          />
          <Icon
            v-else
            class="xs-select__icon"
            :class="{
              'is-active': isTooltipVisible,
            }"
            icon="angle-down"
          />
        </template>
      </Input>
      <template #content>
        <p v-show="isLoading" class="xs-select__text">Loading...</p>
        <ul
          class="xs-select__menu"
          @mousedown.prevent="() => {}"
          v-show="filteredOptions.length && !isLoading"
        >
          <li
            v-for="(option, index) in filteredOptions"
            :key="option.value"
            class="xs-select__menu-item"
            :class="{
              'is-disabled': option.disabled,
              'is-selected': option.value === modelValue,
              'is-highlighted': index === highlightIndex,
            }"
            :id="`select-item-${index}`"
            @click.stop="optionSelect(option)"
            @mouseenter="handleMouseenter(option, index)"
          >
            <RenderVnode :v-node="renderLabel ? renderLabel(option) : option.label" />
          </li>
        </ul>
        <p v-show="!filteredOptions.length && !isLoading" class="xs-select__text">
          No
          {{ options.length && filteredOptions.length !== options.length ? 'matching' : '' }} data
        </p>
      </template>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { isFunction, debounce } from 'lodash-es'
import type { SelectProps, SelectEmits, SelectOption } from './types'
import Input from '../Input/Input.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import Icon from '../Icon/Icon.vue'
import RenderVnode from '../Common/RenderVnode'
import { createMessage } from '../Message'
import type { TooltipInstance } from '../Tooltip/types'
import type { InputInstance } from '../Input/types'

defineOptions({
  name: 'XsSelect',
})

const popperOptions: any = {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 9],
      },
    },
    {
      name: 'sameWidth',
      enabled: true,
      fn: ({ state }: { state: any }) => {
        state.styles.popper.width = `${state.rects.reference.width}px`
      },
      phase: 'beforeWrite',
      requires: ['computeStyles'],
    },
  ],
}

const props = withDefaults(defineProps<SelectProps>(), {
  options: () => [],
})
const emit = defineEmits<SelectEmits>()

const tooltipRef = ref<TooltipInstance | null>(null)
const inputRef = ref<InputInstance | null>(null)

const isTooltipVisible = ref(false)
watch(
  () => isTooltipVisible.value,
  () => {
    if (isTooltipVisible.value) {
      tooltipRef.value?.show()
    } else {
      tooltipRef.value?.hide()
    }
  },
)
const toggleTooltip = () => {
  if (props.disabled) return
  if (!isTooltipVisible.value) {
    if (isRemote.value && filteredOptions.value.length) {
      filteredOptions.value = []
    }
    highlightIndex.value = findIndexByLabel(selectedLabel.value)
  }
  isTooltipVisible.value = !isTooltipVisible.value
  emit('visible-change', isTooltipVisible.value)
}

const handleBlur = () => {
  if (isTooltipVisible.value) {
    toggleTooltip()
  }
}

const findOptionByValue = (value: string | number) => {
  return props.options.find((option) => option.value === value)
}
const findOptionByLabel = (label: string) => {
  return props.options.find((option) => option.label === label)
}

const isRemote = computed(() => props.filterable && props.remote && props.remoteMethod)

const cachedOption = ref<SelectOption>()

const selectedLabel = computed({
  get() {
    return (
      (isRemote.value ? cachedOption.value?.label : findOptionByValue(props.modelValue)?.label) ??
      ''
    )
  },
  set(val: string) {
    let option
    if (isRemote.value) {
      option = filteredOptions.value.find((option) => option.label === val)
    } else {
      option = findOptionByLabel(val)
    }
    emit('update:modelValue', option?.value ?? '')
    emit('change', option?.value ?? '')
  },
})
const displayedLabel = ref(selectedLabel.value)

const filteredOptions = ref<SelectOption[]>(props.options)

const isLoading = ref(false)
const debounceRemoteMethod = debounce(() => {
  isLoading.value = true
  props.remoteMethod!(displayedLabel.value)
    .then((res) => {
      filteredOptions.value = res
    })
    .catch((err) => {
      createMessage({
        type: 'error',
        message: err.message ?? 'Error loading data',
      })
      filteredOptions.value = []
    })
    .finally(() => {
      isLoading.value = false
    })
}, 500)

const computedFilterMethod = computed(
  () => (label: string, option: SelectOption) =>
    props.filterMethod && isFunction(props.filterMethod)
      ? props.filterMethod(label, option)
      : option.label.includes(label),
)
watchEffect(
  () => {
    if (displayedLabel.value === selectedLabel.value && isTooltipVisible.value === false) return

    if (isRemote.value) {
      debounceRemoteMethod()
    } else if (props.filterable) {
      filteredOptions.value = props.options.filter(
        computedFilterMethod.value.bind(null, displayedLabel.value),
      )
    } else {
      filteredOptions.value = props.options
    }
  },
  {
    flush: 'post',
  },
)

const isReadonly = computed(() => !isTooltipVisible.value || !props.filterable)
watch(
  () => [isReadonly.value, selectedLabel.value],
  (val, oldVal) => {
    if (!val[0]) {
      displayedLabel.value = ''
    } else {
      displayedLabel.value = selectedLabel.value
    }
    if (val[1] !== oldVal[1]) {
      displayedLabel.value = selectedLabel.value
    }
  },
)

const optionSelect = (option: SelectOption) => {
  if (option.disabled) return
  if (isRemote.value) {
    cachedOption.value = option
  }
  selectedLabel.value = option.label
  toggleTooltip()
  inputRef.value?.ref.focus()
}

const isHovering = ref(false)
const showClearIcon = computed(
  () => !props.disabled && props.clearable && selectedLabel.value.trim() && isHovering.value,
)
const handleClear = () => {
  selectedLabel.value = ''
  emit('clear')
}

const findIndexByLabel = (label: string) => {
  return filteredOptions.value.findIndex((option) => option.label === label)
}

const highlightIndex = ref(findIndexByLabel(selectedLabel.value))
watch(
  () => [filteredOptions.value, selectedLabel.value],
  () => {
    highlightIndex.value = findIndexByLabel(selectedLabel.value)
  },
)
const handleMouseenter = (option: SelectOption, index: number) => {
  if (option.disabled) return
  highlightIndex.value = index
}
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    if (highlightIndex.value >= 0 && isTooltipVisible.value) {
      optionSelect(filteredOptions.value[highlightIndex.value])
    } else {
      toggleTooltip()
    }
  } else if (e.key === 'Escape') {
    if (isTooltipVisible.value) {
      toggleTooltip()
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()

    do {
      highlightIndex.value =
        highlightIndex.value === filteredOptions.value.length - 1 ? 0 : highlightIndex.value + 1
    } while (filteredOptions.value[highlightIndex.value]?.disabled)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()

    do {
      highlightIndex.value =
        highlightIndex.value === 0 ? filteredOptions.value.length - 1 : highlightIndex.value - 1
    } while (filteredOptions.value[highlightIndex.value]?.disabled)
  }
}
</script>

<style scoped></style>
