import { watch, isRef, onMounted, onUnmounted, type Ref, unref } from 'vue'

export default function useEventListener(
  target: EventTarget | Ref<EventTarget | null>,
  event: string,
  handler: (e: Event) => any,
) {
  onMounted(() => {
    if (isRef(target)) {
      watch(target, (val, oldVal) => {
        oldVal?.removeEventListener(event, handler)
        val?.addEventListener(event, handler)
      })
    } else {
      target.addEventListener(event, handler)
    }
  })
  onUnmounted(() => {
    unref(target)?.removeEventListener(event, handler)
  })
}
