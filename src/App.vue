<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import AppSidebar from './components/layout/AppSidebar.vue'
import AppHeader from './components/layout/AppHeader.vue'
import MobileTabBar from './components/layout/MobileTabBar.vue'

const desktopQuery = window.matchMedia('(min-width: 1024px)')
const isDesktop = ref(desktopQuery.matches)
const sync = (e: MediaQueryListEvent) => (isDesktop.value = e.matches)

onMounted(() => desktopQuery.addEventListener('change', sync))
onBeforeUnmount(() => desktopQuery.removeEventListener('change', sync))
</script>

<template>
  <a href="#main" class="skip-link">Skip to main content</a>
  <div class="shell">
    <AppSidebar v-if="isDesktop" />
    <div class="shell__body">
      <AppHeader />
      <main id="main" class="shell__main" tabindex="-1">
        <RouterView />
      </main>
    </div>
  </div>
  <MobileTabBar v-if="!isDesktop" />
</template>

<style scoped>
.shell {
  display: flex;
  min-height: 100vh;
}

.shell__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.shell__main {
  flex: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--s-8) var(--s-8) var(--s-16);
}

.shell__main:focus {
  outline: none;
}

@media (max-width: 1023px) {
  .shell__main {
    padding: var(--s-6) var(--s-4) calc(var(--s-16) + var(--s-8));
  }
}
</style>
