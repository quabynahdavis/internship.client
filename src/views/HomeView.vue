<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight } from '@lucide/vue'
import CountUp from '../components/home/CountUp.vue'
import CompanyMonogram from '../components/ui/CompanyMonogram.vue'
import { INTERNSHIPS } from '../data/internships'
import { compensationLabel, deadlineLabel, workModeLabel } from '../lib/format'
import { useProfile } from '../stores/profile'

const { completeness } = useProfile()
const spot = ref({ x: 70, y: 30 })

const openRoles = INTERNSHIPS.length
const regions = new Set(INTERNSHIPS.map((i) => i.region)).size
const verified = new Set(INTERNSHIPS.filter((i) => i.company.verified).map((i) => i.company.name)).size
const preview = INTERNSHIPS[8]!

const words = ['Roles', 'matched', 'to', 'your', 'region,', 'skills', 'and', 'term.']

const cta = computed(() =>
  completeness.value.percent < 100
    ? { to: '/profile', label: 'Build your profile' }
    : { to: '/discover', label: 'See matched roles' },
)

function onPointer(e: PointerEvent) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const box = (e.currentTarget as HTMLElement).getBoundingClientRect()
  spot.value = {
    x: ((e.clientX - box.left) / box.width) * 100,
    y: ((e.clientY - box.top) / box.height) * 100,
  }
}
</script>

<template>
  <div class="home">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__copy">
        <p class="eyebrow">Student internships in Ghana</p>
        <h1 id="hero-title">
          <span v-for="(word, i) in words" :key="word" class="word" :style="{ '--i': i }">{{ word }}</span>
        </h1>
        <p class="hero__lead">
          {{ openRoles }} roles are open this term. Each one shows why it fits you, and the application form starts from your saved profile.
        </p>
        <div class="hero__actions">
          <RouterLink :to="cta.to" class="btn btn--primary btn--lg">
            {{ cta.label }}
            <ArrowRight :size="18" :stroke-width="1.75" aria-hidden="true" />
          </RouterLink>
          <RouterLink v-if="cta.to !== '/discover'" to="/discover" class="btn btn--secondary btn--lg">
            Browse open roles
          </RouterLink>
        </div>
      </div>

      <div
        class="stage"
        :style="{ '--sx': `${spot.x}%`, '--sy': `${spot.y}%` }"
        @pointermove="onPointer"
      >
        <span class="stage__block stage__block--blue" aria-hidden="true" />
        <span class="stage__block stage__block--purple" aria-hidden="true" />
        <span class="stage__block stage__block--coral" aria-hidden="true" />
        <article class="stage__card" aria-label="Example matched role">
          <div class="stage__card-head">
            <CompanyMonogram :name="preview.company.name" :size="36" />
            <div>
              <p class="stage__role">{{ preview.role }}</p>
              <p class="stage__company">{{ preview.company.name }}</p>
            </div>
          </div>
          <ul class="stage__meta" role="list">
            <li>{{ preview.workMode === 'remote' ? 'Remote' : `${preview.city} · ${workModeLabel(preview.workMode)}` }}</li>
            <li class="tnum">{{ compensationLabel(preview.compensation) }}</li>
            <li class="tnum">{{ deadlineLabel(preview.deadline) }}</li>
          </ul>
          <p class="stage__why">Matches region · skills overlap · fits your term dates</p>
        </article>
      </div>
    </section>

    <section class="stats" aria-label="Open roles right now">
      <div>
        <p class="stats__value"><CountUp :to="openRoles" /></p>
        <p>Open roles this term</p>
      </div>
      <div>
        <p class="stats__value"><CountUp :to="regions" /></p>
        <p>Regions with a listing</p>
      </div>
      <div>
        <p class="stats__value"><CountUp :to="verified" /></p>
        <p>Employers marked verified</p>
      </div>
    </section>

    <section class="steps" aria-labelledby="steps-title">
      <h2 id="steps-title">Three steps, then you apply</h2>
      <ol>
        <li>
          <span class="steps__n mono">01</span>
          <h3>Tell us where you study</h3>
          <p>Region, programme, level, skills and the months you are free. The draft saves in this browser.</p>
        </li>
        <li>
          <span class="steps__n mono">02</span>
          <h3>Read the match, not a score</h3>
          <p>Each role says whether it shares your region, how many skills overlap, and whether the dates fit.</p>
        </li>
        <li>
          <span class="steps__n mono">03</span>
          <h3>Send the application here</h3>
          <p>Your CV and contact details are already attached. Add a short note, get an application ID, then track it.</p>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: var(--s-16);
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(280px, 0.95fr);
  gap: var(--s-12);
  align-items: center;
}

.eyebrow {
  margin-bottom: var(--s-4);
  color: var(--accent-text);
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero h1 {
  font-size: clamp(2.5rem, 5vw, 4.25rem);
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 0.98;
  max-width: 12ch;
}

.word {
  display: inline-block;
  margin-right: 0.28em;
  animation: rise 720ms var(--ease-out) both;
  animation-delay: calc(var(--i) * 55ms);
}

.hero__lead {
  max-width: 46ch;
  margin-top: var(--s-5);
  font-size: 1.0625rem;
  line-height: 1.55;
  color: var(--text-secondary);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-3);
  margin-top: var(--s-8);
}

.btn--lg {
  min-height: 48px;
  padding: 0 var(--s-5);
  font-size: 1rem;
}

.stage {
  position: relative;
  min-height: 420px;
  border-radius: 28px;
  background:
    radial-gradient(420px circle at var(--sx) var(--sy), rgba(0, 161, 229, 0.22), transparent 55%),
    var(--surface-sunken);
  overflow: hidden;
}

.stage__block {
  position: absolute;
  border-radius: 6px;
}

.stage__block--blue {
  top: 18%;
  right: 8%;
  width: 56px;
  height: 168px;
  background: var(--brand-blue);
}

.stage__block--purple {
  top: 18%;
  right: calc(8% + 68px);
  width: 56px;
  height: 72px;
  background: var(--brand-purple);
}

.stage__block--coral {
  top: calc(18% + 84px);
  right: calc(8% + 68px);
  width: 56px;
  height: 84px;
  background: var(--brand-coral);
}

.stage__card {
  position: absolute;
  left: var(--s-6);
  right: 112px;
  bottom: var(--s-6);
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
  padding: var(--s-5);
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--surface);
  box-shadow: var(--shadow-md);
}

.stage__card-head {
  display: flex;
  align-items: center;
  gap: var(--s-3);
}

.stage__role {
  color: var(--text-primary);
  font-weight: 650;
}

.stage__company,
.stage__meta,
.stage__why {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.stage__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-2) var(--s-4);
  list-style: none;
}

.stage__why {
  color: var(--accent-text);
  font-weight: 600;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--s-6);
  padding: var(--s-8) 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.stats__value {
  color: var(--text-primary);
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1;
}

.stats p:last-child {
  margin-top: var(--s-2);
  color: var(--text-secondary);
}

.steps h2 {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  letter-spacing: -0.035em;
  margin-bottom: var(--s-8);
}

.steps ol {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--s-8);
  list-style: none;
}

.steps__n {
  display: block;
  margin-bottom: var(--s-3);
  color: var(--accent-text);
  font-size: 0.875rem;
  font-weight: 600;
}

.steps h3 {
  margin-bottom: var(--s-2);
  font-size: 1.125rem;
  letter-spacing: -0.02em;
}

.steps p {
  color: var(--text-secondary);
  max-width: 36ch;
}

@keyframes rise {
  from {
    opacity: 0;
    filter: blur(8px);
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    filter: none;
    transform: none;
  }
}

@media (max-width: 900px) {
  .hero,
  .stats,
  .steps ol {
    grid-template-columns: minmax(0, 1fr);
  }

  .hero h1 {
    max-width: none;
  }

  .stage {
    min-height: 360px;
  }

  .stage__card {
    right: var(--s-4);
    left: var(--s-4);
  }

  .stage__block {
    display: none;
  }

  .hero__actions .btn {
    flex: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .word {
    animation: none;
  }
}
</style>
