import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Traps Tab focus inside `container` while `active` is true, moves focus in
 * on open, and restores focus to the element that opened it on close.
 */
export function useFocusTrap(container: Ref<HTMLElement | null>, active: Ref<boolean>, onEscape: () => void) {
  let returnTo: HTMLElement | null = null

  function focusables(): HTMLElement[] {
    if (!container.value) return []
    return [...container.value.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    )
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onEscape()
      return
    }
    if (e.key !== 'Tab') return
    const items = focusables()
    if (!items.length) {
      e.preventDefault()
      container.value?.focus()
      return
    }
    const first = items[0]!
    const last = items[items.length - 1]!
    if (e.shiftKey && (document.activeElement === first || document.activeElement === container.value)) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  watch(
    active,
    async (open) => {
      if (open) {
        returnTo = document.activeElement as HTMLElement | null
        document.addEventListener('keydown', onKeydown)
        await nextTick()
        const preferred = container.value?.querySelector<HTMLElement>('[data-autofocus]')
        ;(preferred ?? container.value)?.focus()
      } else {
        document.removeEventListener('keydown', onKeydown)
        const target = returnTo
        returnTo = null
        if (target?.isConnected) await nextTick(() => target.focus())
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
}
