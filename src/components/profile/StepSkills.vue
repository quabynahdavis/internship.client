<script setup lang="ts">
import { computed } from 'vue'
import { CircleExclamationPoint, Plus } from '@lucide/vue'
import SkillCombobox from './SkillCombobox.vue'
import { INTERNSHIPS } from '../../data/internships'
import { useProfile } from '../../stores/profile'
import type { StepErrors } from '../../lib/profileSteps'

defineProps<{ errors: StepErrors }>()
const { profile } = useProfile()

/** Skills most requested by open roles that the student hasn't added yet. */
const inDemand = computed(() => {
  const owned = new Set(profile.skills.map((s) => s.toLowerCase()))
  const counts = new Map<string, number>()
  for (const i of INTERNSHIPS) for (const s of i.requiredSkills) counts.set(s, (counts.get(s) ?? 0) + 1)
  return [...counts.entries()]
    .filter(([s]) => !owned.has(s.toLowerCase()))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
})

function add(skill: string) {
  profile.skills = [...profile.skills, skill]
}
</script>

<template>
  <div class="group">
    <div class="field">
      <label for="pf-skills" class="label">Core skills &amp; tools</label>
      <SkillCombobox
        id="pf-skills"
        v-model="profile.skills"
        :invalid="Boolean(errors.skills)"
        :described-by="['pf-skills-hint', errors.skills && 'pf-skills-error'].filter(Boolean).join(' ')"
      />
      <p id="pf-skills-hint" class="hint">
        Use ↑ ↓ to browse suggestions, Enter to add, Backspace to remove the last skill.
      </p>
      <p v-if="errors.skills" id="pf-skills-error" class="error-text">
        <CircleExclamationPoint :size="16" :stroke-width="1.75" aria-hidden="true" />
        {{ errors.skills }}
      </p>
    </div>

    <section v-if="inDemand.length" class="demand" aria-labelledby="demand-title">
      <h3 id="demand-title" class="micro">In demand across open roles</h3>
      <ul class="demand__list" role="list">
        <li v-for="[skill, count] in inDemand" :key="skill">
          <button type="button" class="demand__btn" @click="add(skill)">
            <Plus :size="14" :stroke-width="2" aria-hidden="true" />
            {{ skill }}
            <span class="mono tnum demand__count">{{ count }}<span class="visually-hidden"> roles</span></span>
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.demand {
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
}

.demand__list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-2);
  list-style: none;
}

.demand__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: 0 var(--s-3);
  border: 1px dashed var(--border-strong);
  border-radius: var(--r-full);
  background: var(--surface);
  color: var(--text-primary);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color var(--dur-fast) ease-out,
    border-color var(--dur-fast) ease-out,
    transform var(--dur-fast) ease-out;
}

.demand__btn:hover {
  border-style: solid;
  background: var(--surface-hover);
}

.demand__btn:active {
  transform: scale(0.98);
}

.demand__count {
  color: var(--text-muted);
  font-size: 0.75rem;
}

@media (max-width: 767px) {
  .demand__btn {
    min-height: 44px;
  }
}
</style>
