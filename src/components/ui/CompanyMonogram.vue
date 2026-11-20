<script setup lang="ts">
import { computed } from 'vue'
import { initials } from '../../lib/format'

const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 40 })

const HUES = [214, 160, 28, 190, 340, 250, 95, 12]
const hue = computed(() => HUES[[...props.name].reduce((n, c) => n + c.charCodeAt(0), 0) % HUES.length])
</script>

<template>
  <span
    class="monogram"
    :style="{ '--hue': hue, width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.36)}px` }"
    aria-hidden="true"
  >
    {{ initials(name) }}
  </span>
</template>

<style scoped>
.monogram {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border: 1px solid hsl(var(--hue) 40% 50% / 0.25);
  border-radius: var(--r-md);
  background: hsl(var(--hue) 60% 50% / 0.1);
  color: hsl(var(--hue) 55% 28%);
  font-weight: 650;
  letter-spacing: -0.02em;
}

:global([data-theme='dark']) .monogram {
  color: hsl(var(--hue) 70% 78%);
}
</style>
