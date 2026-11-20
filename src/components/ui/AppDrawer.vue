<script setup lang="ts">
import { onBeforeUnmount, ref, toRef, watch } from 'vue'
import { X } from '@lucide/vue'
import { useFocusTrap } from '../../composables/useFocusTrap'

const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    description?: string
    width?: number
  }>(),
  { width: 560 },
)

const emit = defineEmits<{ close: [] }>()

const panel = ref<HTMLElement | null>(null)
const titleId = `drawer-title-${Math.random().toString(36).slice(2, 8)}`

useFocusTrap(panel, toRef(props, 'open'), () => emit('close'))

watch(
  () => props.open,
  (open) => document.documentElement.classList.toggle('scroll-locked', open),
  { immediate: true },
)
onBeforeUnmount(() => document.documentElement.classList.remove('scroll-locked'))
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" class="drawer-root">
        <div class="drawer-scrim" aria-hidden="true" @click="emit('close')" />
        <div
          ref="panel"
          class="drawer"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
          :style="{ '--drawer-width': `${width}px` }"
        >
          <header class="drawer__header">
            <div class="drawer__heading">
              <h2 :id="titleId">{{ title }}</h2>
              <p v-if="description" class="drawer__description">{{ description }}</p>
            </div>
            <button type="button" class="icon-btn" aria-label="Close" @click="emit('close')">
              <X :size="20" :stroke-width="1.75" aria-hidden="true" />
            </button>
          </header>
          <div class="drawer__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="drawer__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-root {
  position: fixed;
  inset: 0;
  z-index: 50;
}

.drawer-scrim {
  position: absolute;
  inset: 0;
  background: var(--scrim);
}

.drawer {
  position: absolute;
  inset: 0 0 0 auto;
  display: flex;
  flex-direction: column;
  width: min(var(--drawer-width), 100vw);
  background: var(--surface);
  border-left: 1px solid var(--border);
  box-shadow: var(--shadow-lg);
}

.drawer:focus {
  outline: none;
}

.drawer__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--s-4);
  padding: var(--s-5) var(--s-6);
  border-bottom: 1px solid var(--border);
}

.drawer__heading {
  display: flex;
  flex-direction: column;
  gap: var(--s-1);
  min-width: 0;
  padding-top: var(--s-2);
}

.drawer__description {
  color: var(--text-secondary);
}

.drawer__body {
  flex: 1;
  overflow-y: auto;
  padding: var(--s-6);
  overscroll-behavior: contain;
}

.drawer__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--s-3);
  padding: var(--s-4) var(--s-6);
  border-top: 1px solid var(--border);
  background: var(--surface);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity var(--dur-panel) var(--ease-out);
}

.drawer-enter-active .drawer,
.drawer-leave-active .drawer {
  transition: transform var(--dur-panel) var(--ease-out);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .drawer,
.drawer-leave-to .drawer {
  transform: translateX(32px);
}

@media (max-width: 767px) {
  .drawer__header,
  .drawer__body,
  .drawer__footer {
    padding-left: var(--s-4);
    padding-right: var(--s-4);
  }

  .drawer__footer {
    padding-bottom: calc(var(--s-4) + env(safe-area-inset-bottom));
  }
}
</style>
