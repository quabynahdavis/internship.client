<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight } from '@lucide/vue'
import BrandMark from './BrandMark.vue'
import { NAV_ITEMS } from '../../navigation'
import { useApplications } from '../../stores/applications'
import { useProfile } from '../../stores/profile'

const { applications } = useApplications()
const { completeness } = useProfile()

const activeCount = computed(
  () => applications.value.filter((a) => a.status !== 'closed' && a.status !== 'offer').length,
)
</script>

<template>
  <aside class="sidebar" aria-label="Primary">
    <div class="sidebar__brand">
      <BrandMark />
    </div>

    <nav aria-label="Main navigation">
      <ul class="nav" role="list">
        <li v-for="item in NAV_ITEMS" :key="item.to">
          <RouterLink :to="item.to" class="nav__link" active-class="is-active">
            <component :is="item.icon" :size="20" :stroke-width="1.75" aria-hidden="true" />
            <span>{{ item.label }}</span>
            <span v-if="item.to === '/applications' && activeCount" class="nav__count tnum">
              {{ activeCount }}<span class="visually-hidden"> active</span>
            </span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <section v-if="completeness.percent < 100" class="strength" aria-labelledby="strength-title">
      <div class="strength__head">
        <h2 id="strength-title" class="micro">Profile strength</h2>
        <span class="mono tnum strength__value">{{ completeness.done }}/{{ completeness.total }}</span>
      </div>
      <div
        class="strength__bar"
        role="progressbar"
        aria-labelledby="strength-title"
        :aria-valuenow="completeness.percent"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <span :style="{ width: `${completeness.percent}%` }" />
      </div>
      <p class="strength__copy">Complete your profile to see why each company matches you.</p>
      <RouterLink to="/profile" class="btn btn--secondary btn--sm btn--block">
        Finish profile
        <ArrowRight :size="16" :stroke-width="1.75" aria-hidden="true" />
      </RouterLink>
    </section>
  </aside>
</template>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: var(--s-6);
  width: 240px;
  height: 100vh;
  padding: var(--s-4) var(--s-3);
  border-right: 1px solid var(--border);
  background: var(--surface);
  overflow-y: auto;
}

.sidebar__brand {
  padding: 0 var(--s-2);
}

.nav {
  display: flex;
  flex-direction: column;
  gap: var(--s-1);
  list-style: none;
}

.nav__link {
  display: flex;
  align-items: center;
  gap: var(--s-3);
  min-height: 44px;
  padding: 0 var(--s-3);
  border-radius: var(--r-full);
  color: var(--text-secondary);
  font-weight: 500;
  text-decoration: none;
  transition:
    background-color var(--dur-fast) ease-out,
    color var(--dur-fast) ease-out;
}

.nav__link:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
}

.nav__link:active {
  transform: scale(0.98);
}

.nav__link.is-active {
  background: var(--accent-soft);
  color: var(--accent-text);
  font-weight: 600;
}

.nav__count {
  margin-left: auto;
  min-width: 24px;
  padding: 2px var(--s-2);
  border-radius: var(--r-full);
  background: var(--surface-sunken);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
}

.strength {
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
  margin-top: auto;
  padding: var(--s-4);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  background: var(--canvas);
}

.strength__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.strength__value {
  color: var(--text-primary);
  font-size: 0.75rem;
}

.strength__bar {
  height: 6px;
  border-radius: var(--r-full);
  background: var(--surface-hover);
  overflow: hidden;
}

.strength__bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--accent);
  transition: width var(--dur-panel) var(--ease-out);
}

.strength__copy {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}
</style>
