import { ref, watch } from 'vue'
import { readStorage, writeStorage } from '../lib/storage'

const KEY = 'ih:saved:v1'
const savedIds = ref<string[]>(readStorage<string[]>(KEY, []))

watch(savedIds, (ids) => writeStorage(KEY, ids), { deep: true })

function isSaved(id: string): boolean {
  return savedIds.value.includes(id)
}

function toggleSaved(id: string) {
  savedIds.value = isSaved(id) ? savedIds.value.filter((s) => s !== id) : [...savedIds.value, id]
}

export function useSaved() {
  return { savedIds, isSaved, toggleSaved }
}
