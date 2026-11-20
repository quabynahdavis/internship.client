<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight, Check, CircleCheck, CircleExclamationPoint, LoaderCircle } from '@lucide/vue'
import PageHeader from '../components/ui/PageHeader.vue'
import MatchPreview from '../components/profile/MatchPreview.vue'
import StepBasics from '../components/profile/StepBasics.vue'
import StepAcademics from '../components/profile/StepAcademics.vue'
import StepSkills from '../components/profile/StepSkills.vue'
import StepAvailability from '../components/profile/StepAvailability.vue'
import StepDocuments from '../components/profile/StepDocuments.vue'
import { useProfile } from '../stores/profile'
import { PROFILE_STEPS, validateStep, type StepErrors, type StepId } from '../lib/profileSteps'
import { readStorage, writeStorage } from '../lib/storage'
import { formatTime } from '../lib/format'

const STEP_KEY = 'ih:profile:step'
const COMPONENTS = {
  basics: StepBasics,
  academics: StepAcademics,
  skills: StepSkills,
  availability: StepAvailability,
  documents: StepDocuments,
}

const route = useRoute()
const router = useRouter()
const { profile, saveState, savedAt } = useProfile()

const isStep = (v: unknown): v is StepId => PROFILE_STEPS.some((s) => s.id === v)
const initial = isStep(route.query.step) ? route.query.step : readStorage<StepId>(STEP_KEY, 'basics')
const current = ref<StepId>(isStep(initial) ? initial : 'basics')
const errors = ref<StepErrors>({})
const errorSummary = ref('')
const stepHeading = ref<HTMLElement | null>(null)

const index = computed(() => PROFILE_STEPS.findIndex((s) => s.id === current.value))
const step = computed(() => PROFILE_STEPS[index.value]!)
const isLast = computed(() => index.value === PROFILE_STEPS.length - 1)
const stepComplete = computed(() =>
  Object.fromEntries(PROFILE_STEPS.map((s) => [s.id, Object.keys(validateStep(s.id, profile)).length === 0])),
)

watch(current, (id) => {
  writeStorage(STEP_KEY, id)
  if (route.query.step) router.replace({ query: {} })
})

watch(
  () => route.query.step,
  (s) => {
    if (isStep(s)) goTo(s)
  },
)

// Clear an error as soon as the field it refers to becomes valid.
watch(
  profile,
  () => {
    if (!Object.keys(errors.value).length) return
    const fresh = validateStep(current.value, profile)
    errors.value = Object.fromEntries(Object.entries(errors.value).filter(([k]) => fresh[k]))
  },
  { deep: true },
)

async function goTo(id: StepId) {
  current.value = id
  errors.value = {}
  errorSummary.value = ''
  await nextTick()
  stepHeading.value?.focus({ preventScroll: true })
  stepHeading.value?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
}

async function next() {
  const found = validateStep(current.value, profile)
  const keys = Object.keys(found)
  if (keys.length) {
    errors.value = found
    errorSummary.value = `Fix ${keys.length} ${keys.length === 1 ? 'field' : 'fields'} to continue.`
    await nextTick()
    const first = document.getElementById(`pf-${keys[0]}`)
    first?.focus()
    return
  }
  if (!isLast.value) return goTo(PROFILE_STEPS[index.value + 1]!.id)

  const incomplete = PROFILE_STEPS.find((s) => !stepComplete.value[s.id])
  if (incomplete) {
    await goTo(incomplete.id)
    errorSummary.value = `“${incomplete.title}” still needs a few details before you can see matches.`
    return
  }
  router.push({ name: 'discover' })
}

function back() {
  if (index.value > 0) goTo(PROFILE_STEPS[index.value - 1]!.id)
}
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Matching intake"
      title="Profile & matching"
      description="Your answers decide which companies we recommend and pre-fill every application. Drafts save automatically."
    >
      <template #actions>
        <p class="save-state" role="status" aria-live="polite">
          <template v-if="saveState === 'saving'">
            <LoaderCircle class="spin" :size="16" :stroke-width="1.75" aria-hidden="true" />
            Saving draft…
          </template>
          <template v-else-if="saveState === 'saved' && savedAt">
            <CircleCheck class="save-state__ok" :size="16" :stroke-width="1.75" aria-hidden="true" />
            Draft saved <span class="mono tnum">{{ formatTime(savedAt) }}</span>
          </template>
          <template v-else-if="saveState === 'error'">
            <CircleExclamationPoint class="save-state__err" :size="16" :stroke-width="1.75" aria-hidden="true" />
            Couldn’t save — storage is full or blocked
          </template>
          <template v-else>Drafts save automatically</template>
        </p>
      </template>
    </PageHeader>

    <div class="layout">
      <div class="main">
        <nav aria-label="Profile steps">
          <p class="stepper__mobile">
            <span class="mono tnum">Step {{ index + 1 }} of {{ PROFILE_STEPS.length }}</span>
          </p>
          <ol class="stepper" role="list">
            <li v-for="(s, i) in PROFILE_STEPS" :key="s.id" class="stepper__item">
              <button
                type="button"
                class="stepper__btn"
                :class="{ 'is-current': s.id === current, 'is-done': stepComplete[s.id] }"
                :aria-current="s.id === current ? 'step' : undefined"
                @click="goTo(s.id)"
              >
                <span class="stepper__index mono" aria-hidden="true">
                  <Check v-if="stepComplete[s.id] && s.id !== current" :size="12" :stroke-width="3" />
                  <template v-else>{{ i + 1 }}</template>
                </span>
                <span class="stepper__title">{{ s.title }}</span>
                <span class="visually-hidden">{{ stepComplete[s.id] ? '(complete)' : '(incomplete)' }}</span>
              </button>
            </li>
          </ol>
        </nav>

        <section class="card form-card" :aria-labelledby="`step-${step.id}`">
          <header class="form-card__header">
            <h2 :id="`step-${step.id}`" ref="stepHeading" tabindex="-1">{{ step.title }}</h2>
            <p class="muted">{{ step.description }}</p>
          </header>

          <div v-if="errorSummary" class="alert" role="alert">
            <CircleExclamationPoint :size="16" :stroke-width="1.75" aria-hidden="true" />
            {{ errorSummary }}
          </div>

          <form class="form-card__body" novalidate @submit.prevent="next">
            <component :is="COMPONENTS[current]" :errors="errors" />

            <footer class="form-card__footer">
              <button v-if="index > 0" type="button" class="btn btn--ghost" @click="back">
                <ArrowLeft :size="16" :stroke-width="1.75" aria-hidden="true" />
                Back
              </button>
              <button type="submit" class="btn btn--primary">
                {{ isLast ? 'Save & see matches' : 'Continue' }}
                <ArrowRight :size="16" :stroke-width="1.75" aria-hidden="true" />
              </button>
            </footer>
          </form>
        </section>
      </div>

      <div class="aside">
        <MatchPreview @go="goTo" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.save-state {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  padding: 0 var(--s-3);
  border: 1px solid var(--border);
  border-radius: var(--r-full);
  background: var(--surface);
  color: var(--text-secondary);
  font-size: 0.8125rem;
}

.save-state__ok {
  color: var(--success-fg);
}

.save-state__err {
  color: var(--danger-fg);
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: var(--s-8);
  align-items: start;
}

.main {
  display: flex;
  flex-direction: column;
  gap: var(--s-5);
  min-width: 0;
}

.aside {
  position: sticky;
  top: calc(64px + var(--s-6));
}

.stepper {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--s-2);
  list-style: none;
}

.stepper__mobile {
  display: none;
}

.stepper__btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--s-2);
  width: 100%;
  min-height: 44px;
  padding: var(--s-3) 0 0;
  border: 0;
  border-top: 2px solid var(--border);
  background: transparent;
  color: var(--text-muted);
  font-size: 0.8125rem;
  font-weight: 550;
  text-align: left;
  cursor: pointer;
  transition:
    color var(--dur-fast) ease-out,
    border-color var(--dur-fast) ease-out;
}

.stepper__btn:hover {
  color: var(--text-primary);
}

.stepper__btn.is-done {
  border-top-color: var(--accent-soft-border);
  color: var(--text-secondary);
}

.stepper__btn.is-current {
  border-top-color: var(--accent);
  color: var(--text-primary);
  font-weight: 600;
}

.stepper__index {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border: 1px solid var(--border-strong);
  border-radius: var(--r-full);
  font-size: 0.6875rem;
}

.stepper__btn.is-done .stepper__index {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent-text);
}

.stepper__btn.is-current .stepper__index {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--on-accent);
}

.stepper__title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.form-card {
  display: flex;
  flex-direction: column;
}

.form-card__header {
  display: flex;
  flex-direction: column;
  gap: var(--s-1);
  padding: var(--s-6) var(--s-6) 0;
}

.form-card__header h2 {
  scroll-margin-top: 96px;
}

.form-card__header h2:focus {
  outline: none;
}

.form-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--s-6);
  padding: var(--s-6);
}

.form-card__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--s-3);
  margin: 0 calc(var(--s-6) * -1) calc(var(--s-6) * -1);
  padding: var(--s-4) var(--s-6);
  border-top: 1px solid var(--border);
}

.alert {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  margin: var(--s-4) var(--s-6) 0;
  padding: var(--s-3) var(--s-4);
  border: 1px solid var(--danger-border);
  border-radius: var(--r-md);
  background: var(--danger-bg);
  color: var(--danger-fg);
  font-weight: 500;
}

@media (max-width: 1099px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .aside {
    position: static;
  }
}

@media (max-width: 767px) {
  .stepper__mobile {
    display: block;
    margin-bottom: var(--s-2);
    font-size: 0.8125rem;
    color: var(--text-secondary);
  }

  .stepper__btn {
    justify-content: center;
    padding-top: var(--s-2);
  }

  .stepper__title {
    display: none;
  }

  .form-card__header {
    padding: var(--s-5) var(--s-4) 0;
  }

  .form-card__body {
    padding: var(--s-5) var(--s-4);
  }

  .form-card__footer {
    margin: 0 calc(var(--s-4) * -1) calc(var(--s-5) * -1);
    padding: var(--s-4);
  }

  .form-card__footer .btn {
    flex: 1;
  }

  .alert {
    margin: var(--s-4) var(--s-4) 0;
  }
}
</style>
