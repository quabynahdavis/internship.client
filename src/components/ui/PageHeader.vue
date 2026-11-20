<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  eyebrow?: string
}>()
</script>

<template>
  <header class="page-header">
    <div class="page-header__text">
      <p v-if="eyebrow" class="micro">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
      <p v-if="description" class="page-header__description prose">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="page-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--s-4) var(--s-6);
  margin-bottom: var(--s-8);
}

.page-header__text {
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
  min-width: 0;
}

.page-header__description {
  font-size: 0.9375rem;
  color: var(--text-secondary);
}

.page-header__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-3);
}

@media (max-width: 767px) {
  .page-header {
    margin-bottom: var(--s-6);
  }
}
</style>
