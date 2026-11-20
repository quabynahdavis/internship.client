<script setup lang="ts">
import { computed } from 'vue'
import { Check, ChevronRight, Circle } from '@lucide/vue'
import MatchChip from '../ui/MatchChip.vue'
import CompanyMonogram from '../ui/CompanyMonogram.vue'
import { useProfile } from '../../stores/profile'
import { useDiscovery } from '../../stores/discovery'
import { fitTier, headlineReasons } from '../../lib/matching'
import { SECTION_STEP, type StepId } from '../../lib/profileSteps'

const emit = defineEmits<{ go: [step: StepId] }>()

const { sections, completeness } = useProfile()
const { scored } = useDiscovery()

const tiers = computed(() => {
  const counts = { strong: 0, possible: 0, stretch: 0 }
  for (const s of scored.value) counts[fitTier(s.match)]++
  return counts
})

const top = computed(() => [...scored.value].sort((a, b) => b.match.score - a.match.score)[0])
</script>

<template>
  <aside class="card preview" aria-labelledby="preview-title">
    <div class="preview__head">
      <h2 id="preview-title">How you match right now</h2>
      <p class="muted">Updates as you type. Strong fit means region, skills and dates all line up.</p>
    </div>

    <dl class="stats" aria-live="polite">
      <div class="stat">
        <dt class="micro">Strong fit</dt>
        <dd class="mono tnum stat__value">{{ tiers.strong }}</dd>
      </div>
      <div class="stat">
        <dt class="micro">Possible</dt>
        <dd class="mono tnum stat__value">{{ tiers.possible }}</dd>
      </div>
      <div class="stat">
        <dt class="micro">Open roles</dt>
        <dd class="mono tnum stat__value">{{ scored.length }}</dd>
      </div>
    </dl>

    <hr class="divider" />

    <div class="checklist">
      <div class="checklist__head">
        <h3 class="micro">Profile checklist</h3>
        <span class="mono tnum muted checklist__count">{{ completeness.done }}/{{ completeness.total }}</span>
      </div>
      <ul role="list" class="checklist__list">
        <li v-for="s in sections" :key="s.id">
          <button type="button" class="check-item" @click="emit('go', SECTION_STEP[s.id])">
            <span class="check-item__icon" :class="{ 'is-done': s.done }" aria-hidden="true">
              <Check v-if="s.done" :size="12" :stroke-width="3" />
              <Circle v-else :size="12" :stroke-width="2" />
            </span>
            <span class="check-item__text">
              <span class="check-item__label">
                {{ s.label }}<span class="visually-hidden">{{ s.done ? ', complete' : ', not complete' }}</span>
              </span>
              <span class="check-item__impact">{{ s.impact }}</span>
            </span>
            <ChevronRight class="check-item__chevron" :size="16" :stroke-width="1.75" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </div>

    <template v-if="top">
      <hr class="divider" />
      <div class="sample">
        <h3 class="micro">Your top match preview</h3>
        <div class="sample__row">
          <CompanyMonogram :name="top.internship.company.name" :size="36" />
          <div class="sample__text">
            <p class="sample__role">{{ top.internship.role }}</p>
            <p class="muted">{{ top.internship.company.name }} · {{ top.internship.city }}</p>
          </div>
        </div>
        <div class="sample__chips">
          <MatchChip v-for="r in headlineReasons(top.match)" :key="r.key" :reason="r" />
          <span v-if="!headlineReasons(top.match).length" class="hint">
            Add your region, skills and dates to see why roles match.
          </span>
        </div>
      </div>
    </template>
  </aside>
</template>

<style scoped>
.preview {
  display: flex;
  flex-direction: column;
  gap: var(--s-5);
  padding: var(--s-5);
}

.preview__head {
  display: flex;
  flex-direction: column;
  gap: var(--s-1);
}

.preview__head h2 {
  font-size: 1rem;
}

.preview__head p {
  font-size: 0.8125rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--s-2);
  margin: 0;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: var(--s-1);
}

.stat dd {
  margin: 0;
}

.stat__value {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
}

.checklist {
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
}

.checklist__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checklist__count {
  font-size: 0.75rem;
}

.checklist__list {
  list-style: none;
  margin: 0 calc(var(--s-2) * -1);
}

.check-item {
  display: flex;
  align-items: flex-start;
  gap: var(--s-3);
  width: 100%;
  min-height: 44px;
  padding: var(--s-2);
  border: 0;
  border-radius: var(--r-md);
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background-color var(--dur-fast) ease-out;
}

.check-item:hover {
  background: var(--surface-hover);
}

.check-item__icon {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  margin-top: 1px;
  flex-shrink: 0;
  border-radius: var(--r-full);
  border: 1px solid var(--border-strong);
  color: var(--text-muted);
}

.check-item__icon.is-done {
  border-color: var(--success-border);
  background: var(--success-bg);
  color: var(--success-fg);
}

.check-item__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.check-item__label {
  color: var(--text-primary);
  font-weight: 550;
}

.check-item__impact {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.check-item__chevron {
  margin-top: 2px;
  color: var(--text-muted);
}

.sample {
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
}

.sample__row {
  display: flex;
  align-items: center;
  gap: var(--s-3);
}

.sample__text {
  min-width: 0;
}

.sample__text p {
  font-size: 0.8125rem;
}

.sample__role {
  color: var(--text-primary);
  font-weight: 600;
}

.sample__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
