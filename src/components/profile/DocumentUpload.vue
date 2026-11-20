<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { CircleExclamationPoint, FileText, Trash, Upload } from '@lucide/vue'
import type { StoredDocument } from '../../types'
import { formatBytes, formatDate } from '../../lib/format'

const props = defineProps<{
  id: string
  label: string
  hint: string
  optional?: boolean
  externalError?: string
}>()

const doc = defineModel<StoredDocument | null>({ required: true })

const MAX_BYTES = 5 * 1024 * 1024
const ACCEPT = ['.pdf', '.doc', '.docx']

const fileInput = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const progress = ref<number | null>(null)
const pendingName = ref('')
const error = ref('')
const status = ref('')
let timer: ReturnType<typeof setInterval> | undefined

function validate(file: File): string {
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
  if (!ACCEPT.includes(ext)) return `“${file.name}” isn’t a supported file. Upload a PDF, DOC or DOCX.`
  if (file.size > MAX_BYTES) return `“${file.name}” is ${formatBytes(file.size)}. The limit is 5 MB.`
  if (file.size === 0) return `“${file.name}” is empty. Choose another file.`
  return ''
}

function accept(file: File) {
  error.value = validate(file)
  if (error.value) {
    status.value = error.value
    return
  }
  clearInterval(timer)
  pendingName.value = file.name
  progress.value = 0
  status.value = `Uploading ${file.name}`
  timer = setInterval(() => {
    progress.value = Math.min(100, (progress.value ?? 0) + 8 + Math.random() * 14)
    if (progress.value >= 100) {
      clearInterval(timer)
      doc.value = { name: file.name, size: file.size, type: file.type, uploadedAt: new Date().toISOString() }
      progress.value = null
      status.value = `${file.name} uploaded`
    }
  }, 120)
}

function onChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) accept(file)
  target.value = ''
}

function onDrop(e: DragEvent) {
  dragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) accept(file)
}

function remove() {
  const name = doc.value?.name
  doc.value = null
  status.value = `${name} removed`
}

function cancel() {
  clearInterval(timer)
  progress.value = null
  status.value = 'Upload cancelled'
}

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="upload">
    <div class="upload__label">
      <span :id="`${id}-label`" class="label">
        {{ label }} <span v-if="optional" class="optional">(optional)</span>
      </span>
      <span :id="`${id}-hint`" class="hint">{{ hint }}</span>
    </div>

    <input
      :id="id"
      ref="fileInput"
      class="visually-hidden"
      type="file"
      :accept="ACCEPT.join(',')"
      tabindex="-1"
      aria-hidden="true"
      @change="onChange"
    />

    <div v-if="progress !== null" class="file" aria-live="off">
      <span class="file__icon"><FileText :size="18" :stroke-width="1.75" aria-hidden="true" /></span>
      <div class="file__meta">
        <span class="file__name">{{ pendingName }}</span>
        <div
          class="file__progress"
          role="progressbar"
          :aria-label="`Uploading ${pendingName}`"
          :aria-valuenow="Math.round(progress)"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <span :style="{ width: `${progress}%` }" />
        </div>
      </div>
      <span class="mono tnum muted file__pct">{{ Math.round(progress) }}%</span>
      <button type="button" class="btn btn--ghost btn--sm" @click="cancel">Cancel</button>
    </div>

    <div v-else-if="doc" class="file">
      <span class="file__icon"><FileText :size="18" :stroke-width="1.75" aria-hidden="true" /></span>
      <div class="file__meta">
        <span class="file__name">{{ doc.name }}</span>
        <span class="file__details muted">
          <span class="mono tnum">{{ formatBytes(doc.size) }}</span>
          <span aria-hidden="true">·</span>
          Uploaded {{ formatDate(doc.uploadedAt) }}
        </span>
      </div>
      <div class="file__actions">
        <button type="button" class="btn btn--secondary btn--sm" :aria-describedby="`${id}-label`" @click="fileInput?.click()">
          Replace
        </button>
        <button type="button" class="icon-btn" :aria-label="`Remove ${doc.name}`" @click="remove">
          <Trash :size="18" :stroke-width="1.75" aria-hidden="true" />
        </button>
      </div>
    </div>

    <div
      v-else
      class="dropzone"
      :class="{ 'is-dragging': dragging, 'is-invalid': error || externalError }"
      @dragenter.prevent="dragging = true"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <span class="dropzone__icon" aria-hidden="true"><Upload :size="18" :stroke-width="1.75" /></span>
      <p class="dropzone__text">
        <strong>Drag a file here</strong> or
      </p>
      <button
        type="button"
        class="btn btn--secondary btn--sm"
        :aria-describedby="`${id}-label ${id}-hint${error || externalError ? ` ${id}-error` : ''}`"
        @click="fileInput?.click()"
      >
        Choose file
      </button>
    </div>

    <p v-if="error || externalError" :id="`${id}-error`" class="error-text">
      <CircleExclamationPoint :size="16" :stroke-width="1.75" aria-hidden="true" />
      {{ error || externalError }}
    </p>

    <p class="visually-hidden" role="status">{{ status }}</p>
  </div>
</template>

<style scoped>
.upload {
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
}

.upload__label {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dropzone {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--s-3);
  padding: var(--s-6) var(--s-4);
  border: 1px dashed var(--border-strong);
  border-radius: var(--r-lg);
  background: var(--canvas);
  text-align: center;
  transition:
    border-color var(--dur-fast) ease-out,
    background-color var(--dur-fast) ease-out;
}

.dropzone.is-dragging {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.dropzone.is-invalid {
  border-color: var(--danger-fg);
}

.dropzone__icon,
.file__icon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  background: var(--surface);
  color: var(--text-secondary);
}

.dropzone__text {
  color: var(--text-secondary);
}

.dropzone__text strong {
  color: var(--text-primary);
  font-weight: 550;
}

.file {
  display: flex;
  align-items: center;
  gap: var(--s-3);
  padding: var(--s-3);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  background: var(--surface);
}

.file__meta {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--s-1);
  min-width: 0;
}

.file__name {
  overflow: hidden;
  color: var(--text-primary);
  font-weight: 550;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file__details {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 0.8125rem;
}

.file__progress {
  height: 4px;
  border-radius: var(--r-full);
  background: var(--surface-hover);
  overflow: hidden;
}

.file__progress span {
  display: block;
  height: 100%;
  background: var(--accent);
  transition: width 120ms linear;
}

.file__pct {
  font-size: 0.75rem;
}

.file__actions {
  display: flex;
  align-items: center;
  gap: var(--s-1);
}

@media (max-width: 479px) {
  .file {
    flex-wrap: wrap;
  }

  .file__actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
