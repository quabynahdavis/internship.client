import type { Internship, MatchLevel, MatchReason, MatchResult, StudentProfile } from '../types'
import { NEIGHBOURING_REGIONS } from '../data/options'
import { monthRange, workModeLabel } from './format'

const WEIGHTS = { region: 30, skills: 35, window: 20, mode: 10, level: 5 } as const
const CREDIT: Record<MatchLevel, number> = { full: 1, partial: 0.5, none: 0, unknown: 0 }

function normalise(skill: string): string {
  return skill.trim().toLowerCase()
}

function regionReason(p: StudentProfile, i: Internship): MatchReason {
  if (i.workMode === 'remote') {
    return { key: 'region', level: 'full', label: 'Remote role', detail: 'Fully remote — open to students in any region.' }
  }
  if (!p.region) {
    return { key: 'region', level: 'unknown', label: 'Add your region', detail: 'Add your region to see location fit.' }
  }
  if (p.region === i.region) {
    return { key: 'region', level: 'full', label: 'Matches region', detail: `Based in ${i.city}, ${i.region} — your home region.` }
  }
  if (NEIGHBOURING_REGIONS[p.region]?.includes(i.region)) {
    return {
      key: 'region',
      level: 'partial',
      label: 'Nearby region',
      detail: `${i.region} borders ${p.region}. Check whether the commute or relocation works for you.`,
    }
  }
  return {
    key: 'region',
    level: 'none',
    label: 'Outside your region',
    detail: `Based in ${i.city}, ${i.region}. You would likely need to relocate.`,
  }
}

function skillsReason(p: StudentProfile, i: Internship, matched: string[]): MatchReason {
  const total = i.requiredSkills.length
  if (p.skills.length === 0) {
    return { key: 'skills', level: 'unknown', label: 'Add skills', detail: `This role asks for ${total} core skills.` }
  }
  const ratio = matched.length / total
  const level: MatchLevel = ratio >= 0.75 ? 'full' : ratio >= 0.4 ? 'partial' : 'none'
  return {
    key: 'skills',
    level,
    label: `${matched.length}/${total} skills`,
    detail: `You have ${matched.length} of the ${total} required skills.`,
  }
}

function windowReason(p: StudentProfile, i: Internship): MatchReason {
  const window = monthRange(i.startMonth, i.endMonth)
  if (!p.availableFrom || !p.availableTo) {
    return { key: 'window', level: 'unknown', label: 'Add availability', detail: `Runs ${window}.` }
  }
  const fits = p.availableFrom <= i.startMonth && p.availableTo >= i.endMonth
  const overlaps = p.availableFrom <= i.endMonth && p.availableTo >= i.startMonth
  if (fits) {
    return { key: 'window', level: 'full', label: `Fits ${window.replace(/ \d{4}$/, '')} window`, detail: `Runs ${window}, inside your availability.` }
  }
  if (overlaps) {
    return { key: 'window', level: 'partial', label: 'Partly overlaps', detail: `Runs ${window}, which only partly overlaps your availability.` }
  }
  return { key: 'window', level: 'none', label: 'Outside availability', detail: `Runs ${window}, outside the window you set.` }
}

function modeReason(p: StudentProfile, i: Internship): MatchReason {
  const label = workModeLabel(i.workMode)
  if (p.workModes.length === 0) {
    return { key: 'mode', level: 'unknown', label: label, detail: `${label} role.` }
  }
  return p.workModes.includes(i.workMode)
    ? { key: 'mode', level: 'full', label: `${label} preferred`, detail: `${label} matches your work-mode preference.` }
    : { key: 'mode', level: 'none', label: `${label} only`, detail: `${label} is not one of your preferred work modes.` }
}

function levelReason(p: StudentProfile, i: Internship): MatchReason {
  if (!p.level) {
    return { key: 'level', level: 'unknown', label: 'Add level', detail: `Open to ${i.levels.join(', ')}.` }
  }
  return i.levels.includes(p.level)
    ? { key: 'level', level: 'full', label: `Open to ${p.level}`, detail: `Accepts ${p.level} students.` }
    : { key: 'level', level: 'none', label: `Not open to ${p.level}`, detail: `Accepts ${i.levels.join(', ')}.` }
}

export function matchInternship(profile: StudentProfile, internship: Internship): MatchResult {
  const owned = new Set(profile.skills.map(normalise))
  const matchedSkills = internship.requiredSkills.filter((s) => owned.has(normalise(s)))
  const missingSkills = internship.requiredSkills.filter((s) => !owned.has(normalise(s)))

  const reasons = [
    regionReason(profile, internship),
    skillsReason(profile, internship, matchedSkills),
    windowReason(profile, internship),
    modeReason(profile, internship),
    levelReason(profile, internship),
  ]

  const score = Math.round(reasons.reduce((sum, r) => sum + WEIGHTS[r.key] * CREDIT[r.level], 0))
  return { score, reasons, matchedSkills, missingSkills }
}

export type FitTier = 'strong' | 'possible' | 'stretch'

/** Strong = location, skills and dates all line up; stretch = at least one is a clear miss. */
export function fitTier(result: MatchResult): FitTier {
  const core = result.reasons.filter((r) => r.key === 'region' || r.key === 'skills' || r.key === 'window')
  if (core.every((r) => r.level === 'full')) return 'strong'
  if (core.some((r) => r.level === 'none')) return 'stretch'
  return 'possible'
}

/** Reasons worth surfacing on compact list rows. */
export function headlineReasons(result: MatchResult): MatchReason[] {
  const order: MatchReason['key'][] = ['region', 'skills', 'window', 'mode']
  return order
    .map((key) => result.reasons.find((r) => r.key === key)!)
    .filter((r) => r.level !== 'unknown' && !(r.key === 'mode' && r.level === 'full'))
}
