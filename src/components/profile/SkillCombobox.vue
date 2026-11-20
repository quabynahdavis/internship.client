<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Plus, X } from '@lucide/vue'
import { SKILLS } from '../../data/options'

const props = defineProps<{
  id: string
  describedBy?: string
  invalid?: boolean
}>()

const skills = defineModel<string[]>({ required: true })

const query = ref('')
const open = ref(false)
const activeIndex = ref(-1)
const announcement = ref('')
const input = ref<HTMLInputElement | null>(null)
const listId = `${props.id}-listbox`

interface Option {
  value: string
  custom: boolean
}

const options = computed<Option[]>(() => {
  const q = query.value.trim().toLowerCase()
  const owned = new Set(skills.value.map((s) => s.toLowerCase()))
  const matches = SKILLS.filter((s) => !owned.has(s.toLowerCase()) && (!q || s.toLowerCase().includes(q)))
    .sort((a, b) => Number(!a.toLowerCase().startsWith(q)) - Number(!b.toLowerCase().startsWith(q)))
    .slice(0, 8)
    .map((value) => ({ value, custom: false }))
  const exact = SKILLS.some((s) => s.toLowerCase() === q) || owned.has(q)
  if (q && !exact) matches.push({ value: query.value.trim(), custom: true })
  return matches
})

watch(options, () => {
  activeIndex.value = options.value.length ? Math.min(Math.max(activeIndex.value, 0), options.value.length - 1) : -1
})

const activeId = computed(() => (open.value && activeIndex.value >= 0 ? `${props.id}-opt-${activeIndex.value}` : undefined))

function add(value: string) {
  const clean = value.trim()
  if (!clean || skills.value.some((s) => s.toLowerCase() === clean.toLowerCase())) return
  skills.value = [...skills.value, clean]
  announcement.value = `${clean} added. ${skills.value.length} skills selected.`
  query.value = ''
  activeIndex.value = 0
  input.value?.focus()
}

function remove(value: string) {
  skills.value = skills.value.filter((s) => s !== value)
  announcement.value = `${value} removed. ${skills.value.length} skills selected.`
  input.value?.focus()
}

function onKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      if (!open.value) open.value = true
      else if (options.value.length) activeIndex.value = (activeIndex.value + 1) % options.value.length
      break
    case 'ArrowUp':
      e.preventDefault()
      if (options.value.length) activeIndex.value = (activeIndex.value - 1 + options.value.length) % options.value.length
      break
    case 'Enter': {
      const option = open.value ? options.value[activeIndex.value] : undefined
      if (option || query.value.trim()) {
        e.preventDefault()
        add(option?.value ?? query.value)
      }
      break
    }
    case 'Escape':
      if (open.value) {
        e.preventDefault()
        e.stopPropagation()
        open.value = false
      }
      break
    case 'Backspace':
      if (!query.value && skills.value.length) remove(skills.value[skills.value.length - 1]!)
      break
  }
}

function onBlur(e: FocusEvent) {
  const next = e.relatedTarget as HTMLElement | null
  if (!next?.closest(`#${listId}`)) open.value = false
}
</script>

<template>
  <div class="combo">
    <div class="combo__control" :class="{ 'is-invalid': invalid }" @click="input?.focus()">
      <ul v-if="skills.length" class="combo__chips" role="list" aria-label="Selected skills">
        <li v-for="skill in skills" :key="skill" class="combo__chip">
          {{ skill }}
          <button type="button" class="combo__remove" :aria-label="`Remove ${skill}`" @click.stop="remove(skill)">
            <X :size="14" :stroke-width="2" aria-hidden="true" />
          </button>
        </li>
      </ul>
      <input
        :id="id"
        ref="input"
        v-model="query"
        class="combo__input"
        type="text"
        role="combobox"
        autocomplete="off"
        aria-autocomplete="list"
        :aria-expanded="open && options.length > 0"
        :aria-controls="listId"
        :aria-activedescendant="activeId"
        :aria-describedby="describedBy"
        :aria-invalid="invalid || undefined"
        :placeholder="skills.length ? 'Add another skill' : 'Type a skill, e.g. Python or Excel'"
        @focus="open = true"
        @input="open = true"
        @keydown="onKeydown"
        @blur="onBlur"
      />
    </div>

    <ul v-show="open && options.length" :id="listId" class="combo__list" role="listbox" aria-label="Skill suggestions">
      <li
        v-for="(option, index) in options"
        :id="`${id}-opt-${index}`"
        :key="option.value + option.custom"
        role="option"
        class="combo__option"
        :class="{ 'is-active': index === activeIndex }"
        :aria-selected="index === activeIndex"
        @mousedown.prevent="add(option.value)"
        @mousemove="activeIndex = index"
      >
        <Plus v-if="option.custom" :size="16" :stroke-width="1.75" aria-hidden="true" />
        <span v-if="option.custom">Add “{{ option.value }}”</span>
        <span v-else>{{ option.value }}</span>
      </li>
    </ul>

    <p class="visually-hidden" aria-live="polite">{{ announcement }}</p>
  </div>
</template>

<style scoped>
.combo {
  position: relative;
}

.combo__control {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 6px var(--s-2);
  border: 1px solid var(--border-strong);
  border-radius: var(--r-md);
  background: var(--surface);
  cursor: text;
  transition: border-color var(--dur-fast) ease-out;
}

.combo__control:hover {
  border-color: var(--text-secondary);
}

.combo__control:focus-within {
  outline: 2px solid var(--focus-ring);
  outline-offset: 1px;
  border-color: var(--focus-ring);
}

.combo__control.is-invalid {
  border-color: var(--danger-fg);
}

.combo__chips {
  display: contents;
  list-style: none;
}

.combo__chip {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 28px;
  padding: 0 2px 0 var(--s-2);
  border: 1px solid var(--accent-soft-border);
  border-radius: var(--r-sm);
  background: var(--accent-soft);
  color: var(--accent-text);
  font-size: 0.8125rem;
  font-weight: 550;
}

.combo__remove {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: var(--r-sm);
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.combo__remove:hover {
  background: var(--accent-soft-border);
}

.combo__input {
  flex: 1;
  min-width: 160px;
  height: 30px;
  padding: 0 var(--s-1);
  border: 0;
  background: transparent;
  color: var(--text-primary);
}

.combo__input::placeholder {
  color: var(--text-muted);
}

.combo__input:focus-visible {
  outline: none;
}

.combo__list {
  position: absolute;
  inset: calc(100% + 4px) 0 auto;
  z-index: 10;
  max-height: 280px;
  overflow-y: auto;
  padding: var(--s-1);
  list-style: none;
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  background: var(--surface);
  box-shadow: var(--shadow-lg);
}

.combo__option {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  min-height: 40px;
  padding: 0 var(--s-3);
  border-radius: var(--r-sm);
  color: var(--text-primary);
  cursor: pointer;
}

.combo__option.is-active {
  background: var(--surface-hover);
  box-shadow: inset 2px 0 0 var(--accent);
}

@media (max-width: 767px) {
  .combo__input {
    font-size: 1rem;
  }

  .combo__option {
    min-height: 44px;
  }
}
</style>
