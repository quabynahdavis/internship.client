<script setup lang="ts">
import { computed } from 'vue'
import { Check, CircleDashed, Minus, X } from '@lucide/vue'
import type { MatchReason } from '../../types'

const props = defineProps<{ reason: MatchReason }>()

const tone = computed(
  () =>
    ({
      full: { cls: 'pill--success', icon: Check, sr: 'Match' },
      partial: { cls: 'pill--warning', icon: Minus, sr: 'Partial match' },
      none: { cls: '', icon: X, sr: 'Mismatch' },
      unknown: { cls: '', icon: CircleDashed, sr: 'Missing from profile' },
    })[props.reason.level],
)
</script>

<template>
  <span class="pill chip" :class="tone.cls" :title="reason.detail">
    <component :is="tone.icon" :size="14" :stroke-width="2" aria-hidden="true" />
    <span class="visually-hidden">{{ tone.sr }}:</span>
    <span class="tnum">{{ reason.label }}</span>
  </span>
</template>

<style scoped>
.chip {
  font-weight: 550;
}
</style>
