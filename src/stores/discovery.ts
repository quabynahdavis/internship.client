import { computed, reactive, ref } from 'vue'
import type { CompensationType, Internship, MatchResult, WorkMode } from '../types'
import { INTERNSHIPS } from '../data/internships'
import { NEIGHBOURING_REGIONS } from '../data/options'
import { daysUntil } from '../lib/format'
import { matchInternship } from '../lib/matching'
import { useProfile } from './profile'
import { useSaved } from './saved'

export type SortKey = 'match' | 'deadline' | 'newest' | 'pay'

export interface Filters {
  query: string
  regions: string[]
  workMode: WorkMode | ''
  industry: string
  compensation: CompensationType | ''
  deadline: 'any' | '7' | '14' | '30'
  savedOnly: boolean
}

export interface ScoredInternship {
  internship: Internship
  match: MatchResult
}

const defaults = (): Filters => ({
  query: '',
  regions: [],
  workMode: '',
  industry: '',
  compensation: '',
  deadline: 'any',
  savedOnly: false,
})

const filters = reactive<Filters>(defaults())
const sort = ref<SortKey>('match')

/** Simulated first fetch so loading states are exercised once per session. */
const loading = ref(true)
let loadStarted = false
function ensureLoaded() {
  if (loadStarted) return
  loadStarted = true
  setTimeout(() => (loading.value = false), 650)
}

const { profile } = useProfile()
const { isSaved } = useSaved()

const scored = computed<ScoredInternship[]>(() =>
  INTERNSHIPS.filter((i) => daysUntil(i.deadline) >= 0).map((internship) => ({
    internship,
    match: matchInternship(profile, internship),
  })),
)

function passes({ internship: i }: ScoredInternship): boolean {
  const q = filters.query.trim().toLowerCase()
  if (q) {
    const haystack = [i.role, i.company.name, i.company.industry, i.city, ...i.requiredSkills].join(' ').toLowerCase()
    if (!haystack.includes(q)) return false
  }
  if (filters.regions.length && !filters.regions.includes(i.region) && i.workMode !== 'remote') return false
  if (filters.workMode && i.workMode !== filters.workMode) return false
  if (filters.industry && i.company.industry !== filters.industry) return false
  if (filters.compensation && i.compensation.type !== filters.compensation) return false
  if (filters.deadline !== 'any' && daysUntil(i.deadline) > Number(filters.deadline)) return false
  if (filters.savedOnly && !isSaved(i.id)) return false
  return true
}

const results = computed<ScoredInternship[]>(() => {
  const list = scored.value.filter(passes)
  const by: Record<SortKey, (a: ScoredInternship, b: ScoredInternship) => number> = {
    match: (a, b) => b.match.score - a.match.score || a.internship.deadline.localeCompare(b.internship.deadline),
    deadline: (a, b) => a.internship.deadline.localeCompare(b.internship.deadline),
    newest: (a, b) => b.internship.postedAt.localeCompare(a.internship.postedAt),
    pay: (a, b) => (b.internship.compensation.max ?? b.internship.compensation.min ?? 0) - (a.internship.compensation.max ?? a.internship.compensation.min ?? 0),
  }
  return [...list].sort(by[sort.value])
})

const activeFilterCount = computed(
  () =>
    (filters.query.trim() ? 1 : 0) +
    filters.regions.length +
    [filters.workMode, filters.industry, filters.compensation].filter(Boolean).length +
    (filters.deadline !== 'any' ? 1 : 0) +
    (filters.savedOnly ? 1 : 0),
)

function clearFilters() {
  Object.assign(filters, defaults())
}

/** Expand the region filter to include neighbouring regions. */
function broadenRegions() {
  const expanded = new Set(filters.regions)
  for (const r of filters.regions) NEIGHBOURING_REGIONS[r]?.forEach((n) => expanded.add(n))
  filters.regions = [...expanded]
}

const canBroaden = computed(() =>
  filters.regions.some((r) => NEIGHBOURING_REGIONS[r]?.some((n) => !filters.regions.includes(n))),
)

function useMyRegion() {
  if (profile.region) filters.regions = [profile.region]
}

export function useDiscovery() {
  ensureLoaded()
  return {
    filters,
    sort,
    loading,
    scored,
    results,
    activeFilterCount,
    clearFilters,
    broadenRegions,
    canBroaden,
    useMyRegion,
  }
}
