import { describe, test, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Tooltip from './Tooltip.vue'
vi.mock('@popperjs/core')
const onVisibleChange = vi.fn()

describe('Tooltip.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  test('basic tooltip', async () => {
    const wrapper = mount(
      () => (
        <div>
          <div id="outside"></div>
          <Tooltip
            content="hello tooltip"
            trigger="click"
            onVisibleChange={onVisibleChange}
          >
            <button id="trigger">Trigger</button>
          </Tooltip>
        </div>
      ),
      {
        attachTo: document.body,
      },
    )
    // 静态测试
    const triggerArea = wrapper.find('#trigger')
    expect(triggerArea.exists()).toBeTruthy()
    expect(wrapper.find('.xs-tooltip__popper').isVisible()).toBeFalsy()
    // 测试点击行为
    triggerArea.trigger('click')
    await vi.runAllTimersAsync()
    expect(wrapper.find('.xs-tooltip__popper').isVisible()).toBeTruthy()
    expect(wrapper.get('.xs-tooltip__popper').text()).toBe('hello tooltip')
    expect(onVisibleChange).toHaveBeenCalledWith(true)
    wrapper.get('#outside').trigger('click')
    await vi.runAllTimersAsync()
    expect(wrapper.find('.xs-tooltip__popper').isVisible()).toBeFalsy()
    expect(onVisibleChange).toHaveBeenLastCalledWith(false)
  })
})
