<script setup lang="ts">
import { NAV_ITEMS } from '../../navigation'
</script>

<template>
  <nav class="tabbar" aria-label="Main navigation">
    <RouterLink
      v-for="item in NAV_ITEMS"
      :key="item.to"
      :to="item.to"
      class="tabbar__link"
      active-class="is-active"
    >
      <component :is="item.icon" :size="20" :stroke-width="1.75" aria-hidden="true" />
      <span>{{ item.shortLabel }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.tabbar {
  position: fixed;
  inset: auto 0 0 0;
  z-index: 30;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: var(--s-1) var(--s-2) calc(var(--s-1) + env(safe-area-inset-bottom));
  border-top: 1px solid var(--border);
  background: var(--surface);
}

.tabbar__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-height: 52px;
  border-radius: var(--r-md);
  color: var(--text-muted);
  font-size: 0.6875rem;
  font-weight: 550;
  text-decoration: none;
}

.tabbar__link:active {
  transform: scale(0.98);
}

.tabbar__link.is-active {
  color: var(--accent-text);
}

.tabbar__link.is-active svg {
  stroke-width: 2;
}
</style>
