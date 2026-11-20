<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Moon, Search, Sun, UserRound } from '@lucide/vue'
import BrandMark from './BrandMark.vue'
import { useTheme } from '../../stores/theme'
import { useProfile } from '../../stores/profile'
import { useDiscovery } from '../../stores/discovery'
import { initials } from '../../lib/format'

const router = useRouter()
const route = useRoute()
const { theme, toggleTheme } = useTheme()
const { profile } = useProfile()
const { filters } = useDiscovery()

const query = ref('')
const userInitials = computed(() => initials(profile.fullName))
const onDiscover = computed(() => route.name === 'discover')

function search() {
  filters.query = query.value.trim()
  query.value = ''
  router.push({ name: 'discover' })
}
</script>

<template>
  <header class="header">
    <div class="header__brand">
      <BrandMark />
    </div>

    <form v-if="!onDiscover" class="search" role="search" @submit.prevent="search">
      <label for="global-search" class="visually-hidden">Search internships</label>
      <Search class="search__icon" :size="16" :stroke-width="1.75" aria-hidden="true" />
      <input
        id="global-search"
        v-model="query"
        class="input search__input"
        type="search"
        placeholder="Search roles, companies or skills"
        autocomplete="off"
        enterkeyhint="search"
      />
    </form>

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
      <RouterLink to="/profile" class="avatar" :aria-label="profile.fullName ? `Profile: ${profile.fullName}` : 'Your profile'">
        <span v-if="userInitials" aria-hidden="true">{{ userInitials }}</span>
        <UserRound v-else :size="18" :stroke-width="1.75" aria-hidden="true" />
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: var(--s-4);
  height: 64px;
  padding: 0 var(--s-6);
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--canvas) 92%, transparent);
  backdrop-filter: saturate(1.2);
}

.header__brand {
  display: none;
}

.search {
  position: relative;
  flex: 1;
  max-width: 480px;
}

.search__icon {
  position: absolute;
  top: 50%;
  left: var(--s-3);
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.search__input {
  padding-left: 36px;
  border-color: var(--border);
  border-radius: var(--r-full);
  background: var(--surface);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  margin-left: auto;
}

.avatar {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: var(--r-full);
  border: 1px solid var(--border);
  background: var(--accent-soft);
  color: var(--accent-text);
  font-size: 0.8125rem;
  font-weight: 650;
  text-decoration: none;
  transition: border-color var(--dur-fast) ease-out;
}

.avatar:hover {
  border-color: var(--accent-soft-border);
}

@media (max-width: 1023px) {
  .header {
    padding: 0 var(--s-4);
  }

  .header__brand {
    display: block;
  }

  .search {
    display: none;
  }

  .avatar {
    width: 44px;
    height: 44px;
  }
}
</style>
