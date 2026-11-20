<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Bookmark, Info, MousePointerClick, SearchX } from '@lucide/vue'
import PageHeader from '../components/ui/PageHeader.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import AppDrawer from '../components/ui/AppDrawer.vue'
import FilterBar from '../components/discover/FilterBar.vue'
import InternshipRow from '../components/discover/InternshipRow.vue'
import InternshipDetail from '../components/discover/InternshipDetail.vue'
import RowSkeleton from '../components/discover/RowSkeleton.vue'
import ApplyDrawer from '../components/discover/ApplyDrawer.vue'
import { useDiscovery, type SortKey } from '../stores/discovery'
import { useProfile } from '../stores/profile'
import { useSaved } from '../stores/saved'
import { useApplications } from '../stores/applications'
import { useMediaQuery } from '../composables/useMediaQuery'

const route = useRoute()
const router = useRouter()
const { filters, sort, loading, scored, results, clearFilters, broadenRegions, canBroaden } = useDiscovery()
const { completeness, sections } = useProfile()
const { savedIds, isSaved, toggleSaved } = useSaved()
const { applicationFor } = useApplications()
const isWide = useMediaQuery('(min-width: 1280px)')
const applyingId = ref<string | null>(null)
const applying = computed(() => scored.value.find((s) => s.internship.id === applyingId.value)?.internship ?? null)

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'match', label: 'Best match' },
  { value: 'deadline', label: 'Deadline (soonest)' },
  { value: 'newest', label: 'Newest' },
  { value: 'pay', label: 'Highest pay' },
]

const queryId = computed(() => (typeof route.query.role === 'string' ? route.query.role : null))
const selectedId = computed(() => queryId.value ?? (isWide.value ? (results.value[0]?.internship.id ?? null) : null))
const selected = computed(() => scored.value.find((s) => s.internship.id === selectedId.value) ?? null)
const drawerOpen = computed(() => !isWide.value && Boolean(queryId.value && selected.value))

const missingSections = computed(() => sections.value.filter((s) => !s.done).map((s) => s.label.toLowerCase()))
const regionText = computed(() =>
  filters.regions.length > 2 ? `${filters.regions.length} regions` : filters.regions.join(' or '),
)

function select(id: string) {
  router.replace({ query: { ...route.query, role: id } })
}

function closeDetail() {
  const { role: _role, ...rest } = route.query
  router.replace({ query: rest })
}

function startApply(id: string) {
  applyingId.value = id
}
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Discover"
      title="Internships matched to you"
      description="Ranked by how well each role fits your region, skills and availability — with the reasons shown on every listing."
    />

    <div v-if="completeness.percent < 100" class="notice">
      <Info :size="16" :stroke-width="1.75" aria-hidden="true" />
      <p>
        Matches use <span class="mono tnum">{{ completeness.done }}/{{ completeness.total }}</span> profile sections.
        Add your {{ missingSections.slice(0, 2).join(' and ') }} for a clearer breakdown.
      </p>
      <RouterLink to="/profile" class="btn btn--secondary btn--sm">Finish profile</RouterLink>
    </div>

    <FilterBar />

    <div class="results-head">
      <p class="results-head__count" role="status">
        <template v-if="loading">Loading roles…</template>
        <template v-else>
          <span class="mono tnum">{{ results.length }}</span> {{ results.length === 1 ? 'role' : 'roles' }}
          <span class="muted">of {{ scored.length }} open</span>
        </template>
      </p>
      <div class="sort">
        <label for="sort" class="micro">Sort</label>
        <select id="sort" v-model="sort" class="select select--sm">
          <option v-for="s in SORTS" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
      </div>
    </div>

    <div class="workspace" :class="{ 'has-pane': isWide }">
      <div class="list card" :aria-busy="loading">
        <template v-if="loading">
          <RowSkeleton v-for="n in 4" :key="n" />
        </template>

        <EmptyState
          v-else-if="!results.length && filters.savedOnly && !savedIds.length"
          :icon="Bookmark"
          title="No saved roles yet"
          description="Use the bookmark on any listing to keep it here while you decide."
        >
          <button type="button" class="btn btn--primary" @click="filters.savedOnly = false">Show all roles</button>
        </EmptyState>

        <EmptyState
          v-else-if="!results.length"
          :icon="SearchX"
          title="No matches for these filters"
          :description="
            filters.regions.length
              ? `No open internships match these filters in ${regionText} yet.`
              : 'No open internships match these filters yet.'
          "
        >
          <button v-if="canBroaden" type="button" class="btn btn--primary" @click="broadenRegions">
            Broaden to nearby regions
          </button>
          <button type="button" class="btn" :class="canBroaden ? 'btn--secondary' : 'btn--primary'" @click="clearFilters">
            Reset filters
          </button>
        </EmptyState>

        <template v-else>
          <h2 class="visually-hidden">Results</h2>
          <InternshipRow
            v-for="item in results"
            :key="item.internship.id"
            :item="item"
            :selected="item.internship.id === selectedId"
            @select="select"
            @apply="startApply"
          />
        </template>
      </div>

      <aside v-if="isWide" class="pane card" aria-label="Internship details">
        <div v-if="loading" class="pane__loading" aria-hidden="true">
          <span class="skeleton" style="width: 48px; height: 48px; border-radius: 8px" />
          <span class="skeleton" style="width: 70%; height: 20px" />
          <span class="skeleton" style="width: 40%; height: 12px" />
          <span class="skeleton" style="width: 100%; height: 140px; border-radius: 12px" />
        </div>
        <InternshipDetail v-else-if="selected" :key="selected.internship.id" :item="selected" show-actions @apply="startApply" />
        <EmptyState
          v-else
          :icon="MousePointerClick"
          title="Select a role"
          description="Choose any listing to see responsibilities, required skills and why it matches you."
        />
      </aside>
    </div>

    <AppDrawer
      v-if="!isWide"
      :open="drawerOpen"
      title="Internship details"
      @close="closeDetail"
    >
      <InternshipDetail v-if="selected" :item="selected" heading-level="h3" />
      <template v-if="selected" #footer>
        <button
          type="button"
          class="btn btn--secondary"
          :aria-pressed="isSaved(selected.internship.id)"
          @click="toggleSaved(selected.internship.id)"
        >
          <Bookmark
            :size="16"
            :stroke-width="1.75"
            aria-hidden="true"
            :fill="isSaved(selected.internship.id) ? 'currentColor' : 'none'"
          />
          {{ isSaved(selected.internship.id) ? 'Saved' : 'Save' }}
        </button>
        <RouterLink
          v-if="applicationFor(selected.internship.id)"
          class="btn btn--primary"
          :to="{ name: 'applications', query: { highlight: applicationFor(selected.internship.id)!.id } }"
        >
          Track application
        </RouterLink>
        <button v-else type="button" class="btn btn--primary" @click="startApply(selected.internship.id)">
          Apply directly
        </button>
      </template>
    </AppDrawer>

    <ApplyDrawer :open="Boolean(applying)" :internship="applying" @close="applyingId = null" />
  </div>
</template>

<style scoped>
.notice {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-3);
  margin-bottom: var(--s-6);
  padding: var(--s-3) var(--s-4);
  border: 1px solid var(--info-border);
  border-radius: var(--r-md);
  background: var(--info-bg);
  color: var(--text-primary);
}

.notice > svg {
  color: var(--info-fg);
  flex-shrink: 0;
}

.notice p {
  flex: 1;
  min-width: 200px;
}

.results-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-3);
  margin: var(--s-5) 0 var(--s-3);
}

.results-head__count {
  color: var(--text-primary);
  font-weight: 550;
}

.sort {
  display: flex;
  align-items: center;
  gap: var(--s-2);
}

.select--sm {
  width: auto;
  min-height: 36px;
}

.workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--s-6);
  align-items: start;
}

.workspace.has-pane {
  grid-template-columns: minmax(0, 1fr) 420px;
}

.list {
  overflow: hidden;
}

.list :deep(.row:last-child) {
  border-bottom: 0;
}

.pane {
  position: sticky;
  top: calc(64px + var(--s-6));
  max-height: calc(100vh - 64px - var(--s-12));
  overflow-y: auto;
  padding: var(--s-6);
  overscroll-behavior: contain;
}

.pane__loading {
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
}

@media (max-width: 767px) {
  .select--sm {
    min-height: 44px;
  }
}
</style>
