<script setup lang="ts">
import { computed } from 'vue'
import { CircleExclamationPoint } from '@lucide/vue'

const props = defineProps<{
  id: string
  label: string
  hint?: string
  error?: string
  optional?: boolean
}>()

const describedBy = computed(
  () => [props.hint && `${props.id}-hint`, props.error && `${props.id}-error`].filter(Boolean).join(' ') || undefined,
)
</script>

<template>
  <div class="field">
    <label :for="id" class="label">
      {{ label }} <span v-if="optional" class="optional">(optional)</span>
    </label>
    <slot :described-by="describedBy" :invalid="Boolean(error)" />
    <p v-if="hint" :id="`${id}-hint`" class="hint">{{ hint }}</p>
    <p v-if="error" :id="`${id}-error`" class="error-text">
      <CircleExclamationPoint :size="16" :stroke-width="1.75" aria-hidden="true" />
      {{ error }}
    </p>
  </div>
</template>
