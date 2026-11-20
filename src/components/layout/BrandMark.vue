<template>
  <RouterLink to="/" class="brand" aria-label="InternHub home">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--brand-navy)" />
      <rect x="7" y="7" width="8" height="18" rx="1.5" fill="var(--brand-blue)" />
      <rect x="17" y="7" width="8" height="8" rx="1.5" fill="var(--brand-purple)" />
      <rect x="17" y="17" width="8" height="8" rx="1.5" fill="var(--brand-coral)" />
    </svg>
    <span class="brand__name">InternHub</span>
  </RouterLink>
</template>

<style scoped>
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding-right: var(--s-2);
  border-radius: var(--r-md);
  color: var(--text-primary);
  text-decoration: none;
}

.brand__name {
  font-size: 1.05rem;
  font-weight: 650;
  letter-spacing: -0.03em;
  line-height: 1;
}
</style>
