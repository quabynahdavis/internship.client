import type { Compensation, WorkMode } from '../types'

const DAY_MS = 86_400_000
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const ghs = new Intl.NumberFormat('en-GH', { maximumFractionDigits: 0 })

export function formatGhs(amount: number): string {
  return `GH₵ ${ghs.format(amount)}`
}

export function compensationLabel(c: Compensation): string {
  if (c.type === 'unpaid') return 'Unpaid'
  if (c.min && c.max && c.min !== c.max) return `${formatGhs(c.min)}–${ghs.format(c.max)} / mo`
  if (c.min) return `${formatGhs(c.min)} / mo`
  return c.type === 'stipend' ? 'Stipend' : 'Paid'
}

export function workModeLabel(mode: WorkMode): string {
  return { onsite: 'On-site', hybrid: 'Hybrid', remote: 'Remote' }[mode]
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

export function daysUntil(iso: string, now = new Date()): number {
  return Math.round((startOfDay(new Date(iso)) - startOfDay(now)) / DAY_MS)
}

export function deadlineLabel(iso: string): string {
  const days = daysUntil(iso)
  if (days < 0) return 'Closed'
  if (days === 0) return 'Closes today'
  if (days === 1) return '1 day left'
  return `${days} days left`
}

export type DeadlineTone = 'closed' | 'urgent' | 'soon' | 'open'

export function deadlineTone(iso: string): DeadlineTone {
  const days = daysUntil(iso)
  if (days < 0) return 'closed'
  if (days <= 3) return 'urgent'
  if (days <= 10) return 'soon'
  return 'open'
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return `${formatDate(iso)}, ${time}`
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export function relativeDays(iso: string): string {
  const days = -daysUntil(iso)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return formatDate(iso)
}

/** "yyyy-mm" month keys. */
export function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function addMonths(key: string, n: number): string {
  const [y, m] = key.split('-').map(Number)
  return monthKey(new Date(y, m - 1 + n, 1))
}

export function monthLabel(key: string, withYear = true): string {
  const [y, m] = key.split('-').map(Number)
  return withYear ? `${MONTHS[m - 1]} ${y}` : MONTHS[m - 1]
}

export function monthRange(from: string, to: string): string {
  if (!from || !to) return ''
  const sameYear = from.slice(0, 4) === to.slice(0, 4)
  return sameYear
    ? `${monthLabel(from, false)}–${monthLabel(to, false)} ${from.slice(0, 4)}`
    : `${monthLabel(from)} – ${monthLabel(to)}`
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('')
}
