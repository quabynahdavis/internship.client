<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{ to: number; suffix?: string }>()
const shown = ref(0)

function run(value: number) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    shown.value = value
    return
  }
  const from = shown.value
  const start = performance.now()
  const duration = 900
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    const eased = 1 - (1 - t) ** 3
    shown.value = Math.round(from + (value - from) * eased)
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

onMounted(() => run(props.to))
watch(() => props.to, run)
</script>

<template>
  <span class="tnum">{{ shown }}{{ suffix }}</span>
</template>
