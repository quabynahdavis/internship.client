<template>
  <div class="row" aria-hidden="true">
    <span class="skeleton avatar" />
    <div class="body">
      <span class="skeleton line" style="width: 46%; height: 16px" />
      <span class="skeleton line" style="width: 30%" />
      <div class="meta">
        <span class="skeleton line" style="width: 96px" />
        <span class="skeleton line" style="width: 120px" />
        <span class="skeleton line" style="width: 88px" />
      </div>
      <div class="foot">
        <div class="meta">
          <span class="skeleton pill" />
          <span class="skeleton pill" />
          <span class="skeleton pill" />
        </div>
        <span class="skeleton button" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  gap: var(--s-4);
  padding: var(--s-5);
  border-bottom: 1px solid var(--border);
}

.avatar {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: var(--r-md);
}

.body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--s-3);
}

.line {
  height: 12px;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-3);
}

.foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--s-3);
}

.pill {
  width: 88px;
  height: 24px;
  border-radius: var(--r-full);
}

.button {
  width: 112px;
  height: 32px;
  border-radius: var(--r-md);
}
</style>
