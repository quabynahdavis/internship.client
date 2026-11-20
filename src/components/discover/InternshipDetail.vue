<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  BadgeCheck,
  Bookmark,
  Check,
  CircleDashed,
  ExternalLink,
  Globe,
  MapPin,
  Minus,
  X,
} from '@lucide/vue'
import CompanyMonogram from '../ui/CompanyMonogram.vue'
import StatusPill from '../ui/StatusPill.vue'
import DeadlinePill from './DeadlinePill.vue'
import type { ScoredInternship } from '../../stores/discovery'
import { useSaved } from '../../stores/saved'
import { useApplications } from '../../stores/applications'
import { useProfile } from '../../stores/profile'
import { compensationLabel, formatDate, monthRange, relativeDays, workModeLabel } from '../../lib/format'

const props = defineProps<{ item: ScoredInternship; headingLevel?: 'h2' | 'h3'; showActions?: boolean }>()
const emit = defineEmits<{ apply: [id: string] }>()

const router = useRouter()
const { isSaved, toggleSaved } = useSaved()
const { applicationFor } = useApplications()
const { profile } = useProfile()

const i = computed(() => props.item.internship)
const m = computed(() => props.item.match)
const saved = computed(() => isSaved(i.value.id))
const application = computed(() => applicationFor(i.value.id))
const owned = computed(() => new Set(profile.skills.map((s) => s.toLowerCase())))
const mapsUrl = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(i.value.company.address)}`)

const LEVEL_ICON = { full: Check, partial: Minus, none: X, unknown: CircleDashed }
const LEVEL_TEXT = { full: 'Match', partial: 'Partial', none: 'Mismatch', unknown: 'Missing' }
const REASON_TITLE = { region: 'Location', skills: 'Skills', window: 'Dates', mode: 'Work mode', level: 'Academic level' }
</script>

<template>
  <div class="detail">
    <header class="detail__header">
      <CompanyMonogram :name="i.company.name" :size="48" />
      <div class="detail__titles">
        <component :is="headingLevel ?? 'h2'" class="detail__role">{{ i.role }}</component>
        <p class="detail__company">
          {{ i.company.name }}
          <span v-if="i.company.verified" class="detail__verified">
            <BadgeCheck :size="16" :stroke-width="1.75" aria-hidden="true" />
            Verified
          </span>
        </p>
        <p class="muted detail__posted">
          Posted {{ relativeDays(i.postedAt) }} · <span class="tnum">{{ i.openings }}</span>
          {{ i.openings === 1 ? 'opening' : 'openings' }}
        </p>
      </div>
    </header>

    <div v-if="showActions" class="detail__actions">
      <template v-if="application">
        <StatusPill :status="application.status" />
        <button type="button" class="btn btn--secondary" @click="router.push({ name: 'applications', query: { highlight: application.id } })">
          Track application
        </button>
      </template>
      <button v-else type="button" class="btn btn--primary" @click="emit('apply', i.id)">Apply directly</button>
      <button
        type="button"
        class="btn btn--secondary"
        :aria-pressed="saved"
        @click="toggleSaved(i.id)"
      >
        <Bookmark :size="16" :stroke-width="1.75" aria-hidden="true" :fill="saved ? 'currentColor' : 'none'" />
        {{ saved ? 'Saved' : 'Save' }}
      </button>
    </div>

    <dl class="facts">
      <div>
        <dt class="micro">Location</dt>
        <dd>{{ i.workMode === 'remote' ? 'Remote' : `${i.city}, ${i.region}` }}</dd>
      </div>
      <div>
        <dt class="micro">Work mode</dt>
        <dd>{{ workModeLabel(i.workMode) }}</dd>
      </div>
      <div>
        <dt class="micro">Dates</dt>
        <dd class="tnum">{{ monthRange(i.startMonth, i.endMonth) }} · {{ i.durationWeeks }} wks</dd>
      </div>
      <div>
        <dt class="micro">Compensation</dt>
        <dd class="tnum">{{ compensationLabel(i.compensation) }}</dd>
      </div>
      <div>
        <dt class="micro">Apply by</dt>
        <dd class="facts__deadline">
          <span class="tnum">{{ formatDate(i.deadline) }}</span>
          <DeadlinePill :deadline="i.deadline" />
        </dd>
      </div>
      <div>
        <dt class="micro">Response</dt>
        <dd class="tnum">Within {{ i.responseDays }} days</dd>
      </div>
    </dl>

    <section class="section" aria-labelledby="why-title">
      <h3 id="why-title" class="section__title">Why this matches you</h3>
      <ul role="list" class="reasons">
        <li v-for="r in m.reasons" :key="r.key" class="reason" :class="`reason--${r.level}`">
          <span class="reason__icon" aria-hidden="true">
            <component :is="LEVEL_ICON[r.level]" :size="14" :stroke-width="2.25" />
          </span>
          <div class="reason__text">
            <p class="reason__title">
              {{ REASON_TITLE[r.key] }}
              <span class="reason__status">{{ LEVEL_TEXT[r.level] }}</span>
            </p>
            <p class="reason__detail">{{ r.detail }}</p>
          </div>
        </li>
      </ul>
      <RouterLink v-if="m.reasons.some((r) => r.level === 'unknown')" to="/profile" class="section__link">
        Complete your profile for a full breakdown
      </RouterLink>
    </section>

    <section class="section" aria-labelledby="skills-title">
      <h3 id="skills-title" class="section__title">
        Required skills
        <span class="mono tnum muted section__count">{{ m.matchedSkills.length }}/{{ i.requiredSkills.length }} you have</span>
      </h3>
      <ul role="list" class="skills">
        <li v-for="s in i.requiredSkills" :key="s" class="skill" :class="owned.has(s.toLowerCase()) ? 'skill--have' : 'skill--missing'">
          <Check v-if="owned.has(s.toLowerCase())" :size="14" :stroke-width="2.25" aria-hidden="true" />
          <X v-else :size="14" :stroke-width="2.25" aria-hidden="true" />
          {{ s }}
          <span class="visually-hidden">{{ owned.has(s.toLowerCase()) ? '(you have this)' : '(not in your profile)' }}</span>
        </li>
      </ul>
      <template v-if="i.niceToHave.length">
        <p class="micro">Nice to have</p>
        <ul role="list" class="skills">
          <li v-for="s in i.niceToHave" :key="s" class="tag">{{ s }}</li>
        </ul>
      </template>
    </section>

    <section class="section" aria-labelledby="role-title">
      <h3 id="role-title" class="section__title">About the role</h3>
      <p class="prose">{{ i.summary }}</p>
      <ul class="bullets">
        <li v-for="r in i.responsibilities" :key="r">{{ r }}</li>
      </ul>
    </section>

    <section class="section" aria-labelledby="company-title">
      <h3 id="company-title" class="section__title">About {{ i.company.name }}</h3>
      <p class="prose">{{ i.company.about }}</p>
      <dl class="company">
        <div>
          <dt class="micro">Industry</dt>
          <dd>{{ i.company.industry }}</dd>
        </div>
        <div>
          <dt class="micro">Size</dt>
          <dd class="tnum">{{ i.company.size }}</dd>
        </div>
        <div>
          <dt class="micro">Founded</dt>
          <dd class="tnum">{{ i.company.founded }}</dd>
        </div>
        <div>
          <dt class="micro">Website</dt>
          <dd class="company__site">
            <Globe :size="14" :stroke-width="1.75" aria-hidden="true" />
            {{ i.company.website }}
          </dd>
        </div>
      </dl>
    </section>

    <section class="section" aria-labelledby="location-title">
      <h3 id="location-title" class="section__title">Location</h3>
      <div class="address">
        <span class="address__icon" aria-hidden="true"><MapPin :size="16" :stroke-width="1.75" /></span>
        <p>{{ i.company.address }}</p>
      </div>
      <a v-if="i.workMode !== 'remote'" :href="mapsUrl" target="_blank" rel="noopener noreferrer" class="section__link">
        Open in Google Maps
        <ExternalLink :size="14" :stroke-width="1.75" aria-hidden="true" />
        <span class="visually-hidden">(opens in a new tab)</span>
      </a>
    </section>
  </div>
</template>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: var(--s-6);
}

.detail__header {
  display: flex;
  gap: var(--s-4);
  align-items: flex-start;
}

.detail__titles {
  display: flex;
  flex-direction: column;
  gap: var(--s-1);
  min-width: 0;
}

.detail__role {
  font-size: 1.25rem;
  font-weight: 650;
  letter-spacing: -0.015em;
  line-height: 1.25;
}

.detail__company {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-2);
  color: var(--text-primary);
  font-weight: 500;
}

.detail__verified {
  display: inline-flex;
  align-items: center;
  gap: var(--s-1);
  color: var(--accent-text);
  font-size: 0.75rem;
  font-weight: 600;
}

.detail__posted {
  font-size: 0.8125rem;
}

.detail__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-3);
}

.detail__actions .btn--secondary[aria-pressed='true'] {
  color: var(--accent-text);
}

.facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--s-4);
  margin: 0;
  padding: var(--s-4);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  background: var(--canvas);
}

.facts div,
.company div {
  display: flex;
  flex-direction: column;
  gap: var(--s-1);
  min-width: 0;
}

.facts dd,
.company dd {
  margin: 0;
  color: var(--text-primary);
  font-weight: 500;
}

.facts__deadline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-2);
}

.section {
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
  padding-top: var(--s-6);
  border-top: 1px solid var(--border);
}

.section__title {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--s-2);
  font-size: 0.9375rem;
}

.section__count {
  font-size: 0.75rem;
  font-weight: 500;
}

.section__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  min-height: 32px;
  font-weight: 550;
}

.reasons {
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
  list-style: none;
}

.reason {
  display: flex;
  gap: var(--s-3);
}

.reason__icon {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border: 1px solid var(--neutral-border);
  border-radius: var(--r-full);
  background: var(--neutral-bg);
  color: var(--neutral-fg);
}

.reason--full .reason__icon {
  border-color: var(--success-border);
  background: var(--success-bg);
  color: var(--success-fg);
}

.reason--partial .reason__icon {
  border-color: var(--warning-border);
  background: var(--warning-bg);
  color: var(--warning-fg);
}

.reason--none .reason__icon {
  border-color: var(--danger-border);
  background: var(--danger-bg);
  color: var(--danger-fg);
}

.reason__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.reason__title {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  color: var(--text-primary);
  font-weight: 600;
}

.reason__status {
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 500;
}

.reason__detail {
  font-size: 0.8125rem;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
}

.skill {
  display: inline-flex;
  align-items: center;
  gap: var(--s-1);
  height: 28px;
  padding: 0 var(--s-2);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  font-size: 0.8125rem;
  font-weight: 500;
}

.skill--have {
  border-color: var(--success-border);
  background: var(--success-bg);
  color: var(--success-fg);
}

.skill--missing {
  border-style: dashed;
  border-color: var(--border-strong);
  color: var(--text-secondary);
}

.bullets {
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
  padding-left: var(--s-5);
}

.bullets li::marker {
  color: var(--text-muted);
}

.company {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--s-4);
  margin: 0;
}

.company__site {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-wrap: anywhere;
}

.address {
  display: flex;
  align-items: flex-start;
  gap: var(--s-3);
  color: var(--text-primary);
}

.address__icon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  background: var(--canvas);
  color: var(--text-secondary);
}

.address p {
  padding-top: 6px;
}

@media (max-width: 479px) {
  .facts,
  .company {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
