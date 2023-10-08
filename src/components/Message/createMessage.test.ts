import { describe, expect, it } from 'vitest'
import { closeAll, createMessage } from '.'
import rAF from '../../utils/rAF'

function getTopValue(element: Element) {
  const styles = window.getComputedStyle(element)
  return parseFloat(styles.getPropertyValue('top'))
}

describe('createMessage', () => {
  it('should create a Message component', async () => {
    const instance = createMessage({
      message: 'hello',
      duration: 0,
    })
    await rAF()
    expect(document.querySelector('.xs-message')).not.toBeNull()
    instance.destroy()
    await rAF()
    expect(document.querySelector('.xs-message')).toBeNull()
  })

  it('should create multiple Message when called multiple times', async () => {
    createMessage({
      message: 'hello',
      duration: 0,
    })
    createMessage({
      message: 'world',
      duration: 0,
    })
    await rAF()
    expect(document.querySelectorAll('.xs-message').length).toBe(2)
    closeAll()
    await rAF()
    expect(document.querySelectorAll('.xs-message').length).toBe(0)
  })

  it('should set correct offset', async () => {
    createMessage({
      message: 'hello',
      duration: 0,
      offset: 100,
    })
    createMessage({
      message: 'world',
      duration: 0,
      offset: 50,
    })
    await rAF()
    const messages = document.querySelectorAll('.xs-message')
    const top1 = getTopValue(messages[0])
    expect(top1).toBe(100)
    const top2 = getTopValue(messages[1])
    expect(top2).toBe(150)
  })
})
