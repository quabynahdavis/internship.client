<script setup lang="ts">
import { Check } from '@lucide/vue'
import FormField from '../ui/FormField.vue'
import { ACADEMIC_LEVELS, INSTITUTIONS, PROGRAMS } from '../../data/options'
import { useProfile } from '../../stores/profile'
import type { StepErrors } from '../../lib/profileSteps'

defineProps<{ errors: StepErrors }>()
const { profile } = useProfile()
</script>

<template>
  <div class="group">
    <FormField
      id="pf-institution"
      label="Institution"
      hint="Start typing to pick from the list, or enter your own."
      :error="errors.institution"
      v-slot="{ describedBy, invalid }"
    >
      <input
        id="pf-institution"
        v-model="profile.institution"
        class="input"
        type="text"
        list="pf-institution-list"
        autocomplete="organization"
        :aria-describedby="describedBy"
        :aria-invalid="invalid || undefined"
      />
      <datalist id="pf-institution-list">
        <option v-for="i in INSTITUTIONS" :key="i" :value="i" />
      </datalist>
    </FormField>

    <FormField id="pf-program" label="Programme or major" :error="errors.program" v-slot="{ describedBy, invalid }">
      <input
        id="pf-program"
        v-model="profile.program"
        class="input"
        type="text"
        list="pf-program-list"
        :aria-describedby="describedBy"
        :aria-invalid="invalid || undefined"
      />
      <datalist id="pf-program-list">
        <option v-for="p in PROGRAMS" :key="p" :value="p" />
      </datalist>
    </FormField>

    <fieldset
      class="field"
      :aria-describedby="errors.level ? 'pf-level-error' : undefined"
      :aria-invalid="errors.level ? true : undefined"
    >
      <legend class="label">Academic level</legend>
      <div id="pf-level" class="option-group option-group--compact" tabindex="-1">
        <label v-for="level in ACADEMIC_LEVELS" :key="level" class="option">
          <input v-model="profile.level" type="radio" name="pf-level" :value="level" />
          <span class="option__check"><Check :size="12" :stroke-width="3" aria-hidden="true" /></span>
          {{ level }}
        </label>
      </div>
      <p v-if="errors.level" id="pf-level-error" class="error-text">{{ errors.level }}</p>
    </fieldset>
  </div>
</template>
