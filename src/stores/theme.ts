import { ref, watch } from 'vue'

type Theme = 'light' | 'dark'
const KEY = 'ih:theme'

const theme = ref<Theme>(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

watch(
  theme,
  (value) => {
    document.documentElement.dataset.theme = value
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#07071a' : '#f9fbfc')
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
