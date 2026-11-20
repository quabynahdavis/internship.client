<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { CircleCheck, LoaderCircle } from '@lucide/vue'
import AppDrawer from '../ui/AppDrawer.vue'
import { useProfile } from '../../stores/profile'
import { useApplications } from '../../stores/applications'
import type { Application, Internship } from '../../types'
import { formatDateTime } from '../../lib/format'

const props = defineProps<{ open: boolean; internship: Internship | null }>()
const emit = defineEmits<{ close: [] }>()

const NOTE_MAX = 400
const router = useRouter()
const { profile } = useProfile()
const { submit } = useApplications()

const note = ref('')
const answers = ref<Record<string, string>>({})
const includeLetter = ref(false)
const phase = ref<'form' | 'submitting' | 'done'>('form')
const receipt = ref<Application | null>(null)
const formError = ref('')

const ready = computed(
  () => Boolean(profile.fullName.trim() && /^\S+@\S+\.\S+$/.test(profile.email.trim()) && profile.cv),
)

watch(
  () => props.open,
  (open) => {
    if (!open) return
    phase.value = 'form'
    note.value = ''
    answers.value = {}
    includeLetter.value = Boolean(profile.letter)
    formError.value = ''
    receipt.value = null
  },
)

async function onSubmit() {
  if (!props.internship || !profile.cv || phase.value === 'submitting') return
  const missing = props.internship.questions.some((q) => !answers.value[q.id]?.trim())
  if (missing) {
    formError.value = 'Answer each question before you send.'
    return
  }
  formError.value = ''
  phase.value = 'submitting'
  await new Promise((resolve) => setTimeout(resolve, 650))
  receipt.value = submit(props.internship, {
    cvName: profile.cv.name,
    letterName: includeLetter.value && profile.letter ? profile.letter.name : null,
    note: note.value.trim(),
    answers: { ...answers.value },
  })
  phase.value = 'done'
}

function track() {
  const id = receipt.value?.id
  emit('close')
  router.push({ name: 'applications', query: id ? { highlight: id } : {} })
}
</script>

<template>
  <AppDrawer
    :open="open"
    :title="phase === 'done' ? 'Application sent' : `Apply to ${internship?.company.name ?? 'this role'}`"
    :description="phase === 'done' ? undefined : internship?.role"
    @close="emit('close')"
  >
    <div v-if="internship && phase === 'done' && receipt" class="receipt">
      <CircleCheck :size="28" :stroke-width="1.75" aria-hidden="true" />
      <p>
        {{ internship.company.name }} has your application for {{ internship.role }}. They usually reply within
        <span class="tnum">{{ internship.responseDays }}</span> days.
      </p>
      <dl>
        <div>
          <dt>Application ID</dt>
          <dd class="mono tnum">{{ receipt.id }}</dd>
        </div>
        <div>
          <dt>Sent</dt>
          <dd class="tnum">{{ formatDateTime(receipt.appliedAt) }}</dd>
        </div>
        <div>
          <dt>CV attached</dt>
          <dd>{{ receipt.cvName }}</dd>
        </div>
      </dl>
    </div>

    <form v-else-if="internship" class="apply" novalidate @submit.prevent="onSubmit">
      <p v-if="!ready" class="apply__block">
        Add your name, email and CV before you can send this.
        <RouterLink to="/profile">Finish profile</RouterLink>
      </p>

      <section v-else class="apply__who" aria-label="Details that will be sent">
        <div>
          <span class="micro">Sending as</span>
          <p>{{ profile.fullName }}</p>
          <p class="muted">{{ profile.email }}</p>
        </div>
        <div>
          <span class="micro">CV</span>
          <p>{{ profile.cv?.name }}</p>
        </div>
      </section>

      <label v-if="profile.letter" class="letter">
        <input v-model="includeLetter" class="checkbox" type="checkbox" />
        Also attach {{ profile.letter.name }}
      </label>

      <fieldset v-for="q in internship.questions" :key="q.id" class="field">
        <legend class="label">{{ q.prompt }}</legend>
        <div v-if="q.kind === 'choice'" class="choices">
          <label v-for="option in q.options" :key="option" class="choice">
            <input v-model="answers[q.id]" class="radio" type="radio" :name="q.id" :value="option" />
            {{ option }}
          </label>
        </div>
        <textarea
          v-else
          v-model="answers[q.id]"
          class="textarea"
          :maxlength="q.maxLength ?? 400"
          :aria-describedby="`${q.id}-count`"
        />
        <p v-if="q.kind === 'text'" :id="`${q.id}-count`" class="hint tnum">
          {{ (answers[q.id] ?? '').length }}/{{ q.maxLength ?? 400 }}
        </p>
      </fieldset>

      <div class="field">
        <label for="apply-note" class="label">Note to the employer <span class="optional">(optional)</span></label>
        <textarea id="apply-note" v-model="note" class="textarea" :maxlength="NOTE_MAX" aria-describedby="apply-note-count" />
        <p id="apply-note-count" class="hint tnum">{{ note.length }}/{{ NOTE_MAX }}</p>
      </div>

      <p v-if="formError" class="error-text" role="alert">{{ formError }}</p>
    </form>

    <template #footer>
      <template v-if="phase === 'done'">
        <button type="button" class="btn btn--secondary" @click="emit('close')">Close</button>
        <button type="button" class="btn btn--primary" @click="track">Track this application</button>
      </template>
      <template v-else>
        <button type="button" class="btn btn--ghost" @click="emit('close')">Cancel</button>
        <button
          type="button"
          class="btn btn--primary"
          :aria-busy="phase === 'submitting'"
          :aria-disabled="!ready || phase === 'submitting'"
          :disabled="!ready"
          @click="onSubmit"
        >
          <LoaderCircle v-if="phase === 'submitting'" class="spin" :size="16" :stroke-width="1.75" aria-hidden="true" />
          {{ phase === 'submitting' ? 'Sending…' : 'Send application' }}
        </button>
      </template>
    </template>
  </AppDrawer>
</template>

<style scoped>
.apply,
.receipt {
  display: flex;
  flex-direction: column;
  gap: var(--s-5);
}

.apply__block {
  padding: var(--s-4);
  border: 1px solid var(--warning-border);
  border-radius: var(--r-lg);
  background: var(--warning-bg);
  color: var(--text-primary);
}

.apply__who {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: var(--s-4);
  padding: var(--s-4);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  background: var(--canvas);
}

.apply__who p:not(.muted) {
  color: var(--text-primary);
  font-weight: 600;
}

.letter,
.choice {
  display: flex;
  align-items: center;
  gap: var(--s-3);
  min-height: 44px;
  color: var(--text-primary);
  cursor: pointer;
}

.choices {
  display: flex;
  flex-direction: column;
}

.receipt svg {
  color: var(--success-fg);
}

.receipt dl {
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
  margin: 0;
}

.receipt dt {
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.receipt dd {
  margin: 2px 0 0;
  color: var(--text-primary);
  font-size: 1.05rem;
  font-weight: 600;
}

@media (max-width: 560px) {
  .apply__who {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
