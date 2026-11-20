<script setup lang="ts">
import { computed, ref } from 'vue'
import { Bookmark, Search, SlidersHorizontal, X } from '@lucide/vue'
import { COMPENSATION_TYPES, DEADLINE_WINDOWS, REGIONS, WORK_MODES } from '../../data/options'
import { INDUSTRIES } from '../../data/internships'
import { useDiscovery } from '../../stores/discovery'
import { useProfile } from '../../stores/profile'

const { filters, activeFilterCount, clearFilters } = useDiscovery()
const { profile } = useProfile()
const panelOpen = ref(false)

const regionValue = computed({
  get: () => (filters.regions.length === 1 ? filters.regions[0]! : filters.regions.length > 1 ? '__multi' : ''),
  set: (v: string) => {
    if (v !== '__multi') filters.regions = v ? [v] : []
  },
})

interface ActiveChip {
  key: string
  label: string
  clear: () => void
}

const chips = computed<ActiveChip[]>(() => {
  const list: ActiveChip[] = []
  if (filters.query.trim()) list.push({ key: 'q', label: `“${filters.query.trim()}”`, clear: () => (filters.query = '') })
  for (const r of filters.regions)
    list.push({ key: `r-${r}`, label: r, clear: () => (filters.regions = filters.regions.filter((x) => x !== r)) })
  if (filters.workMode)
    list.push({
      key: 'mode',
      label: WORK_MODES.find((m) => m.value === filters.workMode)!.label,
      clear: () => (filters.workMode = ''),
    })
  if (filters.industry) list.push({ key: 'ind', label: filters.industry, clear: () => (filters.industry = '') })
  if (filters.compensation)
    list.push({
      key: 'comp',
      label: COMPENSATION_TYPES.find((c) => c.value === filters.compensation)!.label,
      clear: () => (filters.compensation = ''),
    })
  if (filters.deadline !== 'any')
    list.push({
      key: 'dl',
      label: DEADLINE_WINDOWS.find((d) => d.value === filters.deadline)!.label,
      clear: () => (filters.deadline = 'any'),
    })
  if (filters.savedOnly) list.push({ key: 'saved', label: 'Saved only', clear: () => (filters.savedOnly = false) })
  return list
})
</script>

<template>
  <section class="filters" aria-label="Filter internships">
    <div class="filters__top">
      <div class="search">
        <label for="discover-search" class="visually-hidden">Search roles, companies or skills</label>
        <Search class="search__icon" :size="16" :stroke-width="1.75" aria-hidden="true" />
        <input
          id="discover-search"
          v-model="filters.query"
          class="input search__input"
          type="search"
          placeholder="Search roles, companies or skills"
          autocomplete="off"
          enterkeyhint="search"
        />
      </div>
      <button
        type="button"
        class="btn btn--secondary filters__toggle"
        aria-controls="filters-panel"
        :aria-expanded="panelOpen"
        @click="panelOpen = !panelOpen"
      >
        <SlidersHorizontal :size="16" :stroke-width="1.75" aria-hidden="true" />
        Filters
        <span v-if="activeFilterCount" class="mono tnum filters__count">{{ activeFilterCount }}</span>
      </button>
    </div>

    <div id="filters-panel" class="filters__panel" :class="{ 'is-open': panelOpen }">
      <div class="filter">
        <label for="f-region" class="micro">Region</label>
        <select id="f-region" v-model="regionValue" class="select">
          <option value="">All regions</option>
          <option v-if="filters.regions.length > 1" value="__multi" disabled>{{ filters.regions.length }} regions</option>
          <option v-if="profile.region" :value="profile.region">{{ profile.region }} (yours)</option>
          <option v-for="r in REGIONS.filter((x) => x !== profile.region)" :key="r" :value="r">{{ r }}</option>
        </select>
      </div>
      <div class="filter">
        <label for="f-mode" class="micro">Work mode</label>
        <select id="f-mode" v-model="filters.workMode" class="select">
          <option value="">Any mode</option>
          <option v-for="m in WORK_MODES" :key="m.value" :value="m.value">{{ m.label }}</option>
        </select>
      </div>
      <div class="filter">
        <label for="f-industry" class="micro">Industry</label>
        <select id="f-industry" v-model="filters.industry" class="select">
          <option value="">All industries</option>
          <option v-for="i in INDUSTRIES" :key="i" :value="i">{{ i }}</option>
        </select>
      </div>
      <div class="filter">
        <label for="f-comp" class="micro">Compensation</label>
        <select id="f-comp" v-model="filters.compensation" class="select">
          <option value="">Any</option>
          <option v-for="c in COMPENSATION_TYPES" :key="c.value" :value="c.value">{{ c.label }}</option>
        </select>
      </div>
      <div class="filter">
        <label for="f-deadline" class="micro">Deadline</label>
        <select id="f-deadline" v-model="filters.deadline" class="select">
          <option v-for="d in DEADLINE_WINDOWS" :key="d.value" :value="d.value">{{ d.label }}</option>
        </select>
      </div>
      <div class="filter filter--toggle">
        <span class="micro" aria-hidden="true">&nbsp;</span>
        <button
          type="button"
          class="btn btn--secondary saved-toggle"
          :aria-pressed="filters.savedOnly"
          @click="filters.savedOnly = !filters.savedOnly"
        >
          <Bookmark :size="16" :stroke-width="1.75" aria-hidden="true" :fill="filters.savedOnly ? 'currentColor' : 'none'" />
          Saved
        </button>
      </div>
    </div>

    <div v-if="chips.length" class="chips">
      <span class="visually-hidden">Active filters:</span>
      <ul role="list" class="chips__list">
        <li v-for="chip in chips" :key="chip.key">
          <button type="button" class="chip" :aria-label="`Remove filter ${chip.label}`" @click="chip.clear()">
            {{ chip.label }}
            <X :size="14" :stroke-width="2" aria-hidden="true" />
          </button>
        </li>
      </ul>
      <button type="button" class="btn btn--ghost btn--sm" @click="clearFilters">Clear all</button>
    </div>
  </section>
</template>

<style scoped>
.filters {
  display: flex;
  flex-direction: column;
  gap: var(--s-4);
  padding-bottom: var(--s-5);
  border-bottom: 1px solid var(--border);
}

.filters__top {
  display: flex;
  gap: var(--s-3);
}

.search {
  position: relative;
  flex: 1;
}

.search__icon {
  position: absolute;
  top: 50%;
  left: var(--s-3);
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.search__input {
  padding-left: 36px;
}

.filters__toggle {
  display: none;
}

.filters__count {
  min-width: 20px;
  padding: 2px 6px;
  border-radius: var(--r-full);
  background: var(--accent);
  color: var(--on-accent);
  font-size: 0.6875rem;
}

.filters__panel {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr)) auto;
  gap: var(--s-3);
}

.filter {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.saved-toggle[aria-pressed='true'] {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent-text);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-2);
}

.chips__list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-2);
  list-style: none;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  padding: 0 var(--s-2) 0 var(--s-3);
  border: 1px solid var(--accent-soft-border);
  border-radius: var(--r-full);
  background: var(--accent-soft);
  color: var(--accent-text);
  font-size: 0.8125rem;
  font-weight: 550;
  cursor: pointer;
  transition:
    background-color var(--dur-fast) ease-out,
    transform var(--dur-fast) ease-out;
}

.chip:hover {
  background: var(--accent-soft-border);
}

.chip:active {
  transform: scale(0.98);
}

@media (max-width: 1279px) {
  .filters__panel {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .filters__toggle {
    display: inline-flex;
  }

  .filters__panel {
    grid-template-columns: minmax(0, 1fr);
  }

  .filters__panel:not(.is-open) {
    display: none;
  }

  .filter--toggle .micro {
    display: none;
  }

  .chip {
    min-height: 44px;
  }
}
</style>
