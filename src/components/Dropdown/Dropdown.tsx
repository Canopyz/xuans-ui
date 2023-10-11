import { Fragment, computed, defineComponent, ref } from 'vue'
import type { PropType } from 'vue'
import type { Placement, Options } from '@popperjs/core'
import type { MenuOption } from './types'
import Tooltip from '../Tooltip/Tooltip.vue'
import type { TooltipInstance } from '../Tooltip/types'

export default defineComponent({
  name: 'XsDropdown',
  props: {
    placement: {
      type: String as PropType<Placement>,
      default: 'bottom',
    },
    trigger: {
      type: String as PropType<'hover' | 'click'>,
      default: 'hover',
    },
    transition: {
      type: String,
      default: 'fade',
    },
    openDelay: {
      type: Number,
      default: 0,
    },
    closeDelay: {
      type: Number,
      default: 0,
    },
    manual: {
      type: Boolean,
      default: false,
    },
    popperOptions: {
      type: Object as PropType<Partial<Options>>,
    },
    menuOptions: {
      type: Array as PropType<MenuOption[]>,
      required: true,
    },
    hideAfterClick: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['visible-change', 'select'],
  setup(props, { slots, emit, expose }) {
    const tooltipRef = ref<TooltipInstance | null>(null)

    const handleVisibleChange = (value: boolean) => {
      emit('visible-change', value)
    }

    const handleItemClick = (item: MenuOption) => {
      if (item.disabled) {
        return
      }

      emit('select', item)

      if (props.hideAfterClick) {
        tooltipRef?.value?.hide?.()
      }
    }

    const options = computed(() =>
      props.menuOptions.map((item) => (
        <Fragment key={item.key}>
          {item.divided && <li role="separator" class="divided-placeholder" />}
          <li
            class={{
              'xs-dropdown__item': true,
              'is-disabled': item.disabled,
              'is-divided': item.divided,
            }}
            id={`dropdown-item-${item.key}`}
            onClick={() => handleItemClick(item)}
          >
            {item.label}
          </li>
        </Fragment>
      )),
    )

    expose({
      show: () => tooltipRef.value?.show(),
      hide: () => tooltipRef.value?.hide(),
    })

    return () => (
      <div class="xs-dropdown">
        <Tooltip
          trigger={props.trigger}
          placement={props.placement}
          popperOptions={props.popperOptions}
          openDelay={props.openDelay}
          closeDelay={props.closeDelay}
          onVisibleChange={handleVisibleChange}
          manual={props.manual}
          ref={tooltipRef}
        >
          {{
            default: () => slots.default && slots.default(),
            content: () => <ul class="xs-dropdown__menu">{options.value}</ul>,
          }}
        </Tooltip>
      </div>
    )
  },
})
