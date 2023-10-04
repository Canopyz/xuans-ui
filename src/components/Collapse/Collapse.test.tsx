import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import Collapse from './Collapse.vue'
import CollapseItem from './CollapseItem.vue'

describe('Collapse.vue', () => {
  test('basic collapse', async () => {
    const names = ["a", "b", "c"]
    const visibleNames = ['a']
    const items = names.map((item) => (<CollapseItem name={item} title={`title ${item}`} disabled={item === "c"}>{`content ${item}`}</CollapseItem>))
    const changeHandler = vi.fn()
    const wrapper = mount(() => (
      <Collapse modelValue={visibleNames} onChange={changeHandler}>
        {items}
      </Collapse>
    ), {
      global: {
        stubs: ['Icon'],
      },
    })
    const headers = wrapper.findAll('.xs-collapse-item__header')
    const contents = wrapper.findAll('.xs-collapse-item_wrapper')
    expect(headers.length).toBe(3)
    expect(contents.length).toBe(3)
    for (const [ index, name ] of names.entries()) {
      // content
      const header = headers[index]
      const content = contents[index]
      expect(header.text()).toBe(`title ${name}`)
      expect(content.text()).toBe(`content ${name}`)

      // visible
      expect(content.isVisible()).toBe(visibleNames.includes(name))
      
      // collapse
      await header.trigger('click')
      expect(content.isVisible()).toBe(name === "c" ? visibleNames.includes(name) : !visibleNames.includes(name))
      expect(changeHandler).toHaveBeenLastCalledWith(index === 0 ? [] : ['b'])

      // disabled
      if (name === "c") { 
        expect(header.classes()).toContain('is-disabled') 
      } else {
        expect(changeHandler).toBeCalledTimes(index + 1)
      }
    }
  })
})
