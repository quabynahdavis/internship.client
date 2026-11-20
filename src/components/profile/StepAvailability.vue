<script setup lang="ts">
import { computed } from 'vue'
import { Check } from '@lucide/vue'
import FormField from '../ui/FormField.vue'
import { DURATIONS } from '../../data/options'
import { monthKey, monthRange } from '../../lib/format'
import { useProfile } from '../../stores/profile'
import type { StepErrors } from '../../lib/profileSteps'

defineProps<{ errors: StepErrors }>()
const { profile } = useProfile()

const thisMonth = monthKey(new Date())
const summary = computed(() => monthRange(profile.availableFrom, profile.availableTo))
</script>

<template>
  <div class="group">
    <div class="grid grid--2">
      <FormField id="pf-availableFrom" label="Available from" :error="errors.availableFrom" v-slot="{ describedBy, invalid }">
        <input
          id="pf-availableFrom"
          v-model="profile.availableFrom"
          class="input tnum"
          type="month"
          :min="thisMonth"
          :aria-describedby="describedBy"
          :aria-invalid="invalid || undefined"
        />
      </FormField>
      <FormField id="pf-availableTo" label="Available until" :error="errors.availableTo" v-slot="{ describedBy, invalid }">
        <input
          id="pf-availableTo"
          v-model="profile.availableTo"
          class="input tnum"
          type="month"
          :min="profile.availableFrom || thisMonth"
          :aria-describedby="describedBy"
          :aria-invalid="invalid || undefined"
        />
      </FormField>
    </div>

    <p v-if="summary && !errors.availableTo" class="summary" role="status">
      We’ll highlight roles that run within <strong>{{ summary }}</strong>.
    </p>

    <fieldset class="field">
      <legend class="label">Preferred duration</legend>
      <div class="option-group option-group--compact">
        <label v-for="weeks in DURATIONS" :key="weeks" class="option">
          <input v-model.number="profile.durationWeeks" type="radio" name="pf-duration" :value="weeks" />
          <span class="option__check"><Check :size="12" :stroke-width="3" aria-hidden="true" /></span>
          <span class="tnum">{{ weeks }} weeks</span>
        </label>
      </div>
    </fieldset>
  </div>
</template>

<style scoped>
.summary {
  padding: var(--s-3) var(--s-4);
  border: 1px solid var(--accent-soft-border);
  border-radius: var(--r-md);
  background: var(--accent-soft);
  color: var(--text-primary);
}

.summary strong {
  font-weight: 600;
}
</style>
