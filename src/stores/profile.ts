import { computed, reactive, ref, watch } from 'vue'
import type { StudentProfile } from '../types'
import { readStorage, writeStorage } from '../lib/storage'

const KEY = 'ih:profile:v1'
const SAVED_AT_KEY = 'ih:profile:savedAt'

export function emptyProfile(): StudentProfile {
  return {
    fullName: '',
    email: '',
    phone: '',
    region: '',
    city: '',
    commuteKm: 15,
    workModes: [],
    institution: '',
    program: '',
    level: '',
    skills: [],
    availableFrom: '',
    availableTo: '',
    durationWeeks: 12,
    cv: null,
    letter: null,
  }
}

const profile = reactive<StudentProfile>({ ...emptyProfile(), ...readStorage<Partial<StudentProfile>>(KEY, {}) })
const savedAt = ref<number | null>(readStorage<number | null>(SAVED_AT_KEY, null))
const saveState = ref<'idle' | 'saving' | 'saved' | 'error'>(savedAt.value ? 'saved' : 'idle')

let timer: ReturnType<typeof setTimeout> | undefined
watch(
  profile,
  () => {
    saveState.value = 'saving'
    clearTimeout(timer)
    timer = setTimeout(() => {
      const ok = writeStorage(KEY, profile)
      if (ok) {
        savedAt.value = Date.now()
        writeStorage(SAVED_AT_KEY, savedAt.value)
      }
      saveState.value = ok ? 'saved' : 'error'
    }, 400)
  },
  { deep: true },
)

export interface ProfileSection {
  id: 'basics' | 'location' | 'academics' | 'skills' | 'availability' | 'documents'
  label: string
  done: boolean
  impact: string
}

const sections = computed<ProfileSection[]>(() => [
  {
    id: 'basics',
    label: 'Contact details',
    done: Boolean(profile.fullName.trim() && /\S+@\S+\.\S+/.test(profile.email)),
    impact: 'Pre-fills every application',
  },
  {
    id: 'location',
    label: 'Region & work mode',
    done: Boolean(profile.region && profile.workModes.length),
    impact: 'Unlocks region and work-mode matching',
  },
  {
    id: 'academics',
    label: 'Institution & level',
    done: Boolean(profile.institution && profile.program && profile.level),
    impact: 'Filters out roles not open to your level',
  },
  {
    id: 'skills',
    label: 'At least 3 skills',
    done: profile.skills.length >= 3,
    impact: 'Drives the skills breakdown on each role',
  },
  {
    id: 'availability',
    label: 'Availability window',
    done: Boolean(profile.availableFrom && profile.availableTo),
    impact: 'Shows which roles fit your dates',
  },
  {
    id: 'documents',
    label: 'CV uploaded',
    done: Boolean(profile.cv),
    impact: 'Required to apply directly',
  },
])

const completeness = computed(() => {
  const done = sections.value.filter((s) => s.done).length
  return { done, total: sections.value.length, percent: Math.round((done / sections.value.length) * 100) }
})

function resetProfile() {
  Object.assign(profile, emptyProfile())
}

export function useProfile() {
  return { profile, savedAt, saveState, sections, completeness, resetProfile }
}
