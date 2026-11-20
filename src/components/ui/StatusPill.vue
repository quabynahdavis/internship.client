<script setup lang="ts">
import { computed, type Component } from 'vue'
import { CircleCheck, CircleX, Eye, Send, Star, Users } from '@lucide/vue'
import type { ApplicationStatus } from '../../types'

const props = defineProps<{ status: ApplicationStatus }>()

const CONFIG: Record<ApplicationStatus, { label: string; tone: string; icon: Component }> = {
  submitted: { label: 'Submitted', tone: '', icon: Send },
  under_review: { label: 'Under review', tone: 'pill--warning', icon: Eye },
  shortlisted: { label: 'Shortlisted', tone: 'pill--info', icon: Star },
  interview: { label: 'Interview', tone: 'pill--teal', icon: Users },
  offer: { label: 'Offer', tone: 'pill--success', icon: CircleCheck },
  closed: { label: 'Closed', tone: 'pill--danger', icon: CircleX },
}

const config = computed(() => CONFIG[props.status])
</script>

<template>
  <span class="pill" :class="config.tone">
    <component :is="config.icon" :size="14" :stroke-width="1.75" aria-hidden="true" />
    {{ config.label }}
  </span>
</template>
