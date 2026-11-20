<script setup lang="ts">
import { computed, nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Inbox } from '@lucide/vue'
import PageHeader from '../components/ui/PageHeader.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import StatusPill from '../components/ui/StatusPill.vue'
import CompanyMonogram from '../components/ui/CompanyMonogram.vue'
import { useApplications } from '../stores/applications'
import { formatDate } from '../lib/format'

const route = useRoute()
const { applications, hasSamples, removeSamples } = useApplications()

const highlight = computed(() => (typeof route.query.highlight === 'string' ? route.query.highlight : ''))
const rows = computed(() => [...applications.value].sort((a, b) => b.appliedAt.localeCompare(a.appliedAt)))

function reveal() {
  if (!highlight.value) return
  nextTick(() => document.getElementById(`app-${highlight.value}`)?.scrollIntoView({ block: 'center' }))
}

onMounted(reveal)
watch(highlight, reveal)
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Applications"
      title="Where each application stands"
      description="Submitted roles stay here with the date you sent them and the latest status."
    />

    <div v-if="hasSamples" class="sample">
      <p>Four rows below are examples, so the tracker isn’t empty on a first visit.</p>
      <button type="button" class="btn btn--secondary btn--sm" @click="removeSamples">Remove examples</button>
    </div>

    <EmptyState
      v-if="!rows.length"
      :icon="Inbox"
      title="No applications yet"
      description="When you apply from Discover, the receipt and status show up in this list."
    >
      <RouterLink to="/discover" class="btn btn--primary">See matched roles</RouterLink>
    </EmptyState>

    <div v-else class="sheet card">
      <table>
        <caption class="visually-hidden">Applications you have sent</caption>
        <thead>
          <tr>
            <th scope="col">Company</th>
            <th scope="col">Role</th>
            <th scope="col">Region</th>
            <th scope="col">Date applied</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :id="`app-${row.id}`"
            :key="row.id"
            :class="{ 'is-highlight': row.id === highlight }"
          >
            <td data-label="Company">
              <span class="company">
                <CompanyMonogram :name="row.companyName" :size="32" />
                <span>
                  <span class="company__name">{{ row.companyName }}</span>
                  <span class="mono tnum company__id">{{ row.id }}</span>
                </span>
              </span>
            </td>
            <th scope="row" data-label="Role">{{ row.role }}</th>
            <td data-label="Region">{{ row.city }}, {{ row.region }}</td>
            <td class="tnum" data-label="Date applied">{{ formatDate(row.appliedAt) }}</td>
            <td data-label="Status"><StatusPill :status="row.status" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.sample {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-3);
  margin-bottom: var(--s-5);
  padding: var(--s-3) var(--s-4);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  background: var(--surface);
  color: var(--text-secondary);
}

.sheet {
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th,
td {
  padding: var(--s-4) var(--s-5);
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

thead th {
  color: var(--text-muted);
  font-size: 0.6875rem;
  font-weight: 650;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

tbody th {
  font-weight: 600;
  color: var(--text-primary);
}

tbody tr:last-child th,
tbody tr:last-child td {
  border-bottom: 0;
}

tbody tr.is-highlight {
  background: var(--accent-soft);
  box-shadow: inset 3px 0 0 var(--accent);
}

.company {
  display: flex;
  align-items: center;
  gap: var(--s-3);
}

.company__name,
.company__id {
  display: block;
}

.company__name {
  color: var(--text-primary);
  font-weight: 600;
}

.company__id {
  color: var(--text-muted);
  font-size: 0.75rem;
}

@media (max-width: 760px) {
  thead {
    display: none;
  }

  table,
  tbody,
  tr,
  th,
  td {
    display: block;
    width: 100%;
  }

  tbody tr {
    padding: var(--s-4) 0;
    border-bottom: 1px solid var(--border);
  }

  th,
  td {
    padding: var(--s-1) var(--s-4);
    border: 0;
  }

  td[data-label]::before,
  th[data-label]::before {
    content: attr(data-label);
    display: block;
    margin-bottom: 2px;
    color: var(--text-muted);
    font-size: 0.6875rem;
    font-weight: 650;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  tbody tr:last-child {
    border-bottom: 0;
  }
}
</style>
