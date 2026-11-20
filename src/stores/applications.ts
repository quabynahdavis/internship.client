import { computed, ref, watch } from 'vue'
import type { Application, ApplicationStatus, Internship } from '../types'
import { readStorage, writeStorage } from '../lib/storage'
import { findInternship } from '../data/internships'

const KEY = 'ih:applications:v1'

const SAMPLE_HISTORY: { internshipId: string; status: ApplicationStatus; daysAgo: number; updatedDaysAgo: number }[] = [
  { internshipId: 'osu-telecom-network', status: 'interview', daysAgo: 16, updatedDaysAgo: 2 },
  { internshipId: 'goldcoast-logistics', status: 'under_review', daysAgo: 6, updatedDaysAgo: 3 },
  { internshipId: 'civic-voice-comms', status: 'offer', daysAgo: 25, updatedDaysAgo: 1 },
  { internshipId: 'coastline-media-design', status: 'closed', daysAgo: 30, updatedDaysAgo: 12 },
]

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86_400_000).toISOString()
}

function buildSamples(): Application[] {
  return SAMPLE_HISTORY.flatMap(({ internshipId, status, daysAgo: applied, updatedDaysAgo }, index) => {
    const i = findInternship(internshipId)
    if (!i) return []
    return [
      {
        id: `APP-${new Date().getFullYear()}-${String(3107 + index * 1379).slice(-4)}`,
        internshipId,
        companyName: i.company.name,
        role: i.role,
        region: i.region,
        city: i.city,
        appliedAt: daysAgo(applied),
        updatedAt: daysAgo(updatedDaysAgo),
        status,
        cvName: 'Sample_CV.pdf',
        letterName: null,
        note: '',
        answers: {},
        responseDays: i.responseDays,
        sample: true,
      },
    ]
  })
}

const applications = ref<Application[]>(readStorage<Application[] | null>(KEY, null) ?? buildSamples())

watch(applications, (list) => writeStorage(KEY, list), { deep: true, immediate: true })

const hasSamples = computed(() => applications.value.some((a) => a.sample))

function generateId(): string {
  const year = new Date().getFullYear()
  const taken = new Set(applications.value.map((a) => a.id))
  let id: string
  do {
    id = `APP-${year}-${Math.floor(1000 + Math.random() * 9000)}`
  } while (taken.has(id))
  return id
}

export interface SubmitPayload {
  cvName: string
  letterName: string | null
  note: string
  answers: Record<string, string>
}

function submit(internship: Internship, payload: SubmitPayload): Application {
  const now = new Date().toISOString()
  const application: Application = {
    id: generateId(),
    internshipId: internship.id,
    companyName: internship.company.name,
    role: internship.role,
    region: internship.region,
    city: internship.city,
    appliedAt: now,
    updatedAt: now,
    status: 'submitted',
    responseDays: internship.responseDays,
    ...payload,
  }
  applications.value = [application, ...applications.value]
  return application
}

function applicationFor(internshipId: string): Application | undefined {
  return applications.value.find((a) => a.internshipId === internshipId && a.status !== 'closed')
}

function removeSamples() {
  applications.value = applications.value.filter((a) => !a.sample)
}

function withdraw(id: string) {
  applications.value = applications.value.map((a): Application =>
    a.id === id ? { ...a, status: 'closed', updatedAt: new Date().toISOString() } : a,
  )
}

export function useApplications() {
  return { applications, hasSamples, submit, applicationFor, removeSamples, withdraw }
}
