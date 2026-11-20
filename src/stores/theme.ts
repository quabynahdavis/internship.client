import { ref, watch } from 'vue'

type Theme = 'light' | 'dark'
const KEY = 'ih:theme'

const theme = ref<Theme>(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

watch(
  theme,
  (value) => {
    document.documentElement.dataset.theme = value
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#0b0c0e' : '#f8fafc')
    try {
      localStorage.setItem(KEY, value)
    } catch {}
  },
  { immediate: true },
)

export function useTheme() {
  return {
    theme,
    toggleTheme: () => (theme.value = theme.value === 'dark' ? 'light' : 'dark'),
  }
}
