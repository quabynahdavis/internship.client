<script setup lang="ts">
import { Check } from '@lucide/vue'
import FormField from '../ui/FormField.vue'
import { REGIONS, WORK_MODES } from '../../data/options'
import { useProfile } from '../../stores/profile'
import type { StepErrors } from '../../lib/profileSteps'

defineProps<{ errors: StepErrors }>()
const { profile } = useProfile()

const MODE_HINTS = { onsite: 'At the office daily', hybrid: 'Mix of office and home', remote: 'Work from anywhere' }
</script>

<template>
  <fieldset class="group">
    <legend class="group__legend">Contact details</legend>
    <div class="grid grid--2">
      <FormField id="pf-fullName" label="Full name" :error="errors.fullName" v-slot="{ describedBy, invalid }">
        <input
          id="pf-fullName"
          v-model="profile.fullName"
          class="input"
          type="text"
          autocomplete="name"
          :aria-describedby="describedBy"
          :aria-invalid="invalid || undefined"
        />
      </FormField>
      <FormField id="pf-email" label="Email" :error="errors.email" v-slot="{ describedBy, invalid }">
        <input
          id="pf-email"
          v-model="profile.email"
          class="input"
          type="email"
          autocomplete="email"
          inputmode="email"
          :aria-describedby="describedBy"
          :aria-invalid="invalid || undefined"
        />
      </FormField>
      <FormField id="pf-phone" label="Phone" optional :error="errors.phone" v-slot="{ describedBy, invalid }">
        <input
          id="pf-phone"
          v-model="profile.phone"
          class="input tnum"
          type="tel"
          autocomplete="tel"
          inputmode="tel"
          placeholder="024 123 4567"
          :aria-describedby="describedBy"
          :aria-invalid="invalid || undefined"
        />
      </FormField>
    </div>
  </fieldset>

  <hr class="divider" />

  <fieldset class="group">
    <legend class="group__legend">Location</legend>
    <div class="grid grid--2">
      <FormField
        id="pf-region"
        label="Region"
        hint="Used to rank roles in and near your region."
        :error="errors.region"
        v-slot="{ describedBy, invalid }"
      >
        <select
          id="pf-region"
          v-model="profile.region"
          class="select"
          :aria-describedby="describedBy"
          :aria-invalid="invalid || undefined"
        >
          <option value="" disabled>Select a region</option>
          <option v-for="r in REGIONS" :key="r" :value="r">{{ r }}</option>
        </select>
      </FormField>
      <FormField id="pf-city" label="City or town" optional v-slot="{ describedBy }">
        <input
          id="pf-city"
          v-model="profile.city"
          class="input"
          type="text"
          autocomplete="address-level2"
          placeholder="e.g. Kumasi"
          :aria-describedby="describedBy"
        />
      </FormField>
    </div>

    <div class="field">
      <div class="range-head">
        <label for="pf-commute" class="label">Maximum daily commute</label>
        <output for="pf-commute" class="mono tnum range-value">{{ profile.commuteKm }} km</output>
      </div>
      <input
        id="pf-commute"
        v-model.number="profile.commuteKm"
        class="range"
        type="range"
        min="5"
        max="60"
        step="5"
        aria-describedby="pf-commute-hint"
        :aria-valuetext="`${profile.commuteKm} kilometres`"
      />
      <p id="pf-commute-hint" class="hint">Applies to on-site and hybrid roles.</p>
    </div>

    <fieldset
      class="field"
      :aria-describedby="errors.workModes ? 'pf-workModes-error' : undefined"
      :aria-invalid="errors.workModes ? true : undefined"
    >
      <legend class="label">Work mode preference <span class="optional">— choose all that apply</span></legend>
      <div id="pf-workModes" class="option-group" tabindex="-1">
        <label v-for="m in WORK_MODES" :key="m.value" class="option option--stacked">
          <input v-model="profile.workModes" type="checkbox" :value="m.value" />
          <span class="option__check option__check--square"><Check :size="12" :stroke-width="3" aria-hidden="true" /></span>
          <span class="option__text">
            <span>{{ m.label }}</span>
            <span class="option__hint">{{ MODE_HINTS[m.value] }}</span>
          </span>
        </label>
      </div>
      <p v-if="errors.workModes" id="pf-workModes-error" class="error-text">{{ errors.workModes }}</p>
    </fieldset>
  </fieldset>
</template>
