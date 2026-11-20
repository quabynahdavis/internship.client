<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Moon, Sun, UserRound } from '@lucide/vue'
import BrandMark from './BrandMark.vue'
import { NAV_ITEMS } from '../../navigation'
import { useTheme } from '../../stores/theme'
import { useProfile } from '../../stores/profile'
import { useMediaQuery } from '../../composables/useMediaQuery'
import { initials } from '../../lib/format'

const route = useRoute()
const isDesktop = useMediaQuery('(min-width: 1024px)')
const { theme, toggleTheme } = useTheme()
const { profile, completeness } = useProfile()

const userInitials = computed(() => initials(profile.fullName))
const cta = computed(() =>
  completeness.value.percent < 100
    ? { to: '/profile', label: 'Finish profile' }
    : route.name === 'discover'
      ? null
      : { to: '/discover', label: 'See matches' },
)
</script>

<template>
  <header class="header">
    <BrandMark />

    <nav v-if="isDesktop" class="nav" aria-label="Main">
      <RouterLink v-for="item in NAV_ITEMS" :key="item.to" :to="item.to" class="nav__link" active-class="is-active">
        {{ item.label }}
      </RouterLink>
    </nav>

    <div class="header__actions">
      <button
        type="button"
        class="icon-btn"
        :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggleTheme"
      >
        <Sun v-if="theme === 'dark'" :size="20" :stroke-width="1.75" aria-hidden="true" />
        <Moon v-else :size="20" :stroke-width="1.75" aria-hidden="true" />
      </button>
      <RouterLink
        to="/profile"
        class="avatar"
        :aria-label="profile.fullName ? `Profile: ${profile.fullName}` : 'Your profile'"
      >
        <span v-if="userInitials" aria-hidden="true">{{ userInitials }}</span>
        <UserRound v-else :size="18" :stroke-width="1.75" aria-hidden="true" />
      </RouterLink>
      <RouterLink v-if="cta && isDesktop" :to="cta.to" class="btn btn--primary">{{ cta.label }}</RouterLink>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: var(--s-4);
  height: 72px;
  padding: 0 var(--s-6);
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--canvas) 92%, transparent);
}

.nav {
  display: flex;
  align-items: center;
  gap: var(--s-1);
}

.nav__link {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 var(--s-3);
  border-radius: var(--r-full);
  color: var(--text-primary);
  font-weight: 500;
  text-decoration: none;
  transition:
    color var(--dur-fast) ease-out,
    background-color var(--dur-fast) ease-out;
}

.nav__link.is-active {
  color: var(--accent-text);
  font-weight: 650;
}

.header__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--s-2);
}

.avatar {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: var(--r-full);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--brand-navy);
  font-size: 0.8125rem;
  font-weight: 650;
  text-decoration: none;
}

:global([data-theme='dark']) .avatar {
  color: var(--text-primary);
}

@media (hover: hover) and (pointer: fine) {
  .nav__link:hover {
    background: var(--surface-hover);
  }

  .avatar:hover {
    border-color: var(--accent);
  }
}

@media (min-width: 1024px) {
  .header {
    grid-template-columns: 1fr auto 1fr;
    padding: 0 var(--s-8);
  }
}

@media (max-width: 1023px) {
  .header {
    padding: 0 var(--s-4);
  }

  .avatar {
    width: 44px;
    height: 44px;
  }
}
</style>
