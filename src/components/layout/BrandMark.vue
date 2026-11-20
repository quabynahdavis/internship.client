<template>
  <RouterLink to="/" class="brand" aria-label="InternHub home">
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--accent)" />
      <path d="M10 9.5h4v13h-4zM18 15.5h4v7h-4z" fill="#fff" />
      <path d="M18 9.5h4v3.5h-4z" fill="#93C5FD" />
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
  font-size: 1rem;
  font-weight: 650;
  letter-spacing: -0.02em;
}
</style>
