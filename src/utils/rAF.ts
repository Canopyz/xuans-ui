import { nextTick } from 'vue'

const rAF = async () => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        resolve(null)
        await nextTick()
      })
    })
  })
}

export default rAF
