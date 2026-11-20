<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  title: string
  description: string
}>()
</script>

<template>
  <div class="empty" role="status">
    <span class="empty__icon" aria-hidden="true">
      <component :is="icon" :size="20" :stroke-width="1.75" />
    </span>
    <h2 class="empty__title">{{ title }}</h2>
    <p class="empty__description">{{ description }}</p>
    <div v-if="$slots.default" class="empty__actions">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-2);
  padding: var(--s-12) var(--s-6);
  text-align: center;
}

.empty__icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  margin-bottom: var(--s-2);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  background: var(--surface-sunken);
  color: var(--text-secondary);
}

.empty__title {
  font-size: 1rem;
}

.empty__description {
  max-width: 44ch;
  color: var(--text-secondary);
}

.empty__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--s-3);
  margin-top: var(--s-4);
}
</style>
