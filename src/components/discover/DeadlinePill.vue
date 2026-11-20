<script setup lang="ts">
import { computed } from 'vue'
import { Clock } from '@lucide/vue'
import { deadlineLabel, deadlineTone, formatDate } from '../../lib/format'

const props = defineProps<{ deadline: string }>()

const tone = computed(
  () => ({ closed: 'pill--danger', urgent: 'pill--danger', soon: 'pill--warning', open: '' })[deadlineTone(props.deadline)],
)
</script>

<template>
  <span class="pill" :class="tone" :title="`Applications close ${formatDate(deadline)}`">
    <Clock :size="14" :stroke-width="1.75" aria-hidden="true" />
    <span class="tnum">{{ deadlineLabel(deadline) }}</span>
  </span>
</template>
