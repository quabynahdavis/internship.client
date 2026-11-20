<script setup lang="ts">
import { computed } from 'vue'
import { BadgeCheck, Bookmark, Briefcase, CalendarRange, MapPin, Wallet } from '@lucide/vue'
import CompanyMonogram from '../ui/CompanyMonogram.vue'
import MatchChip from '../ui/MatchChip.vue'
import StatusPill from '../ui/StatusPill.vue'
import DeadlinePill from './DeadlinePill.vue'
import type { ScoredInternship } from '../../stores/discovery'
import { useSaved } from '../../stores/saved'
import { useApplications } from '../../stores/applications'
import { compensationLabel, monthRange, workModeLabel } from '../../lib/format'
import { fitTier, headlineReasons } from '../../lib/matching'

const props = defineProps<{ item: ScoredInternship; selected: boolean }>()
const emit = defineEmits<{ select: [id: string]; apply: [id: string] }>()

const { isSaved, toggleSaved } = useSaved()
const { applicationFor } = useApplications()

const i = computed(() => props.item.internship)
const reasons = computed(() => headlineReasons(props.item.match))
const tier = computed(() => fitTier(props.item.match))
const application = computed(() => applicationFor(i.value.id))
const saved = computed(() => isSaved(i.value.id))
const titleId = computed(() => `row-title-${i.value.id}`)
</script>

<template>
  <article class="row" :class="{ 'is-selected': selected }" :aria-labelledby="titleId">
    <CompanyMonogram :name="i.company.name" :size="40" />

    <div class="row__body">
      <div class="row__head">
        <div class="row__titles">
          <h3 :id="titleId" class="row__role">
            <button
              type="button"
              class="row__link"
              :aria-current="selected ? 'true' : undefined"
              @click="emit('select', i.id)"
            >
              {{ i.role }}
            </button>
          </h3>
          <p class="row__company">
            <span class="row__company-name">{{ i.company.name }}</span>
            <BadgeCheck
              v-if="i.company.verified"
              class="row__verified"
              :size="16"
              :stroke-width="1.75"
              aria-label="Verified employer"
              role="img"
            />
            <span aria-hidden="true">·</span>
            <span>{{ i.company.industry }}</span>
          </p>
        </div>
        <span v-if="tier === 'strong'" class="pill pill--success row__tier">Strong fit</span>
      </div>

      <ul class="row__meta" role="list">
        <li>
          <MapPin :size="16" :stroke-width="1.75" aria-hidden="true" />
          {{ i.workMode === 'remote' ? 'Remote' : `${i.city}, ${i.region} · ${workModeLabel(i.workMode)}` }}
        </li>
        <li>
          <Briefcase :size="16" :stroke-width="1.75" aria-hidden="true" />
          <span class="tnum">{{ i.durationWeeks }} weeks</span>
        </li>
        <li>
          <CalendarRange :size="16" :stroke-width="1.75" aria-hidden="true" />
          <span class="tnum">{{ monthRange(i.startMonth, i.endMonth) }}</span>
        </li>
        <li :class="{ 'is-unpaid': i.compensation.type === 'unpaid' }">
          <Wallet :size="16" :stroke-width="1.75" aria-hidden="true" />
          <span class="tnum">{{ compensationLabel(i.compensation) }}</span>
        </li>
      </ul>

      <div class="row__foot">
        <div class="row__chips" :aria-label="`Why ${i.company.name} matches you`" role="group">
          <DeadlinePill :deadline="i.deadline" />
          <MatchChip v-for="r in reasons" :key="r.key" :reason="r" />
        </div>
        <div class="row__actions">
          <button
            type="button"
            class="icon-btn"
            :aria-pressed="saved"
            :aria-label="saved ? `Remove ${i.role} from saved` : `Save ${i.role}`"
            @click="toggleSaved(i.id)"
          >
            <Bookmark :size="18" :stroke-width="1.75" aria-hidden="true" :fill="saved ? 'currentColor' : 'none'" />
          </button>
          <template v-if="application">
            <StatusPill :status="application.status" />
          </template>
          <button
            v-else
            type="button"
            class="btn btn--primary btn--sm"
            :aria-label="`Apply directly to ${i.role} at ${i.company.name}`"
            @click="emit('apply', i.id)"
          >
            Apply directly
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.row {
  position: relative;
  display: flex;
  gap: var(--s-4);
  padding: var(--s-5);
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  transition: background-color var(--dur-fast) ease-out;
}

.row:hover {
  background: var(--surface-hover);
}

.row.is-selected {
  background: var(--accent-soft);
  box-shadow: inset 3px 0 0 var(--accent);
}

.row__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--s-3);
  min-width: 0;
}

.row__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--s-3);
}

.row__titles {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.row__role {
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.35;
}

.row__link {
  padding: 0;
  border: 0;
  background: none;
  color: var(--text-primary);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

/* Whole row is clickable; inner controls sit above this overlay. */
.row__link::after {
  content: '';
  position: absolute;
  inset: 0;
}

.row__link:hover {
  color: var(--accent-text);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.row__link:focus-visible {
  outline: none;
}

.row:has(.row__link:focus-visible) {
  outline: 2px solid var(--focus-ring);
  outline-offset: -2px;
}

.row__company {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 0.8125rem;
}

.row__company-name {
  color: var(--text-primary);
  font-weight: 500;
}

.row__verified {
  color: var(--accent-text);
}

.row__tier {
  flex-shrink: 0;
}

.row__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-1) var(--s-4);
  list-style: none;
  color: var(--text-secondary);
  font-size: 0.8125rem;
}

.row__meta li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.row__meta svg {
  color: var(--text-muted);
}

.row__meta .is-unpaid {
  color: var(--text-muted);
}

.row__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-3);
}

.row__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.row__actions {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: var(--s-2);
  margin-left: auto;
}

@media (max-width: 767px) {
  .row {
    padding: var(--s-4);
    gap: var(--s-3);
  }

  .row__actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
