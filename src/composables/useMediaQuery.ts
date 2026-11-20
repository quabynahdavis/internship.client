import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useMediaQuery(query: string) {
  const mql = window.matchMedia(query)
  const matches = ref(mql.matches)
  const sync = (e: MediaQueryListEvent) => (matches.value = e.matches)
  onMounted(() => mql.addEventListener('change', sync))
  onBeforeUnmount(() => mql.removeEventListener('change', sync))
  return matches
}
