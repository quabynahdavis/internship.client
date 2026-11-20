<script setup lang="ts">
import DocumentUpload from './DocumentUpload.vue'
import { useProfile } from '../../stores/profile'
import type { StepErrors } from '../../lib/profileSteps'

defineProps<{ errors: StepErrors }>()
const { profile } = useProfile()
</script>

<template>
  <div class="group">
    <DocumentUpload
      id="pf-cv"
      v-model="profile.cv"
      label="CV / Résumé"
      hint="PDF, DOC or DOCX, up to 5 MB. Used as the default on every application."
      :external-error="errors.cv"
    />
    <hr class="divider" />
    <DocumentUpload
      id="pf-letter"
      v-model="profile.letter"
      label="Introductory letter"
      hint="An internship or introductory letter from your institution. Some companies require it."
      optional
    />
    <p class="hint">
      This prototype only keeps the file name and size — files are not sent anywhere.
    </p>
  </div>
</template>
