import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from './Input.vue'

describe('Input', () => {
  it('should render correctly', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'value',
        type: 'text',
        size: 'small'
      },
      slots: {
        prepend: 'prepend',
        prefix: 'prefix'
      }
    })

    // class
    expect(wrapper.classes()).toContain('xs-input--text')
    expect(wrapper.classes()).toContain('xs-input--small')
    expect(wrapper.classes()).toContain('is-prepend')
    expect(wrapper.classes()).toContain('is-prefix')

    // input
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('type')).toBe('text')

    // slots
    const prepend = wrapper.find('.xs-input__prepend')
    expect(prepend.exists()).toBe(true)
    expect(prepend.text()).toBe('prepend')
    const prefix = wrapper.find('.xs-input__prefix')
    expect(prefix.exists()).toBe(true)
    expect(prefix.text()).toBe('prefix')

    // textarea
    const wrapper2 = mount(Input, {
      props: {
        modelValue: 'value',
        type: 'textarea'
      }
    })
    expect(wrapper2.find('textarea').exists()).toBe(true)
  })

  it('should support v-model', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'value',
        'onUpdate:modelValue': (val: string) => {
          wrapper.setProps({ modelValue: val })
        }
      }
    })
    const input = wrapper.get('input')
    expect(input.element.value).toBe('value')

    await input.setValue('value2')
    expect(wrapper.props('modelValue')).toBe('value2')
    expect(input.element.value).toBe('value2')

    await wrapper.setProps({ modelValue: 'value3' })
    expect(input.element.value).toBe('value3')
  })

  it('should support clearable', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'value',
        type: 'text',
        clearable: true,
        'onUpdate:modelValue': (val: string) => {
          wrapper.setProps({ modelValue: val })
        }
      },
      global: {
        stubs: ['Icon']
      }
    })

    expect(wrapper.find('.xs-input__clear').exists()).toBe(false)
    const input = wrapper.get('input')
    await input.trigger('focus')

    expect(wrapper.find('.xs-input__clear').exists()).toBe(true)

    await wrapper.get('.xs-input__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.get('input').element.value).toBe('')
  })

  it('should support password', async () => {
    const wrapper = mount(Input, {
      props: {
        type: 'password',
        modelValue: '',
        showPassword: true,
        'onUpdate:modelValue': (val: string) => {
          wrapper.setProps({ modelValue: val })
        }
      },
      global: {
        stubs: ['Icon']
      }
    })
    const input = wrapper.get('input')
    expect(input.element.type).toBe('password')

    expect(wrapper.find('.xs-input__password').exists()).toBe(false)

    await input.setValue('value')
    expect(wrapper.find('.xs-input__password').exists()).toBe(true)

    const icon = wrapper.get('.xs-input__password')
    expect(icon.attributes('icon')).toBe('eye-slash')

    await icon.trigger('click')
    expect(icon.attributes('icon')).toBe('eye')
    expect(wrapper.get('input').element.type).toBe('text')
  })

  it('should emit events', async () => {
    const wrapper = mount(Input, {
      props: {
        clearable: true,
        modelValue: 'value',
        'onUpdate:modelValue': (val: string) => {
          wrapper.setProps({ modelValue: val })
        }
      },
      global: {
        stubs: ['Icon']
      }
    })

    const input = wrapper.get('input')
    await input.setValue('newValue')
    expect(wrapper.emitted('change')?.[0]).toEqual(['newValue'])
    expect(wrapper.emitted('input')?.[0]).toEqual(['newValue'])

    await input.trigger('focus')
    expect(wrapper.emitted('focus')?.[0]).toEqual([expect.any(FocusEvent)])

    await wrapper.get('.xs-input__clear').trigger('click')
    expect(wrapper.emitted('clear')?.[0]).toEqual([])
    expect(wrapper.emitted('change')?.[2]).toEqual([''])
    expect(wrapper.emitted('input')?.[2]).toEqual([''])

    await input.trigger('blur')
    expect(wrapper.emitted('blur')?.[0]).toEqual([expect.any(FocusEvent)])
  })
})
