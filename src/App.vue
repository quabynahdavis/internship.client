<script setup lang="ts">
import AppHeader from './components/layout/AppHeader.vue'
import MobileTabBar from './components/layout/MobileTabBar.vue'
import { useMediaQuery } from './composables/useMediaQuery'

const isDesktop = useMediaQuery('(min-width: 1024px)')
</script>

<template>
  <a href="#main" class="skip-link">Skip to main content</a>
  <div class="shell">
    <AppHeader />
    <main id="main" class="shell__main" tabindex="-1">
      <RouterView />
    </main>
  </div>
  <MobileTabBar v-if="!isDesktop" />
</template>

<style scoped>
.shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.shell__main {
  flex: 1;
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: var(--s-12) var(--s-8) var(--s-16);
}

.shell__main:focus {
  outline: none;
}

@media (max-width: 1023px) {
  .shell__main {
    padding: var(--s-8) var(--s-4) calc(var(--s-16) + var(--s-8));
  }
}
</style>
