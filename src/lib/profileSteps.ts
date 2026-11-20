import type { StudentProfile } from '../types'
import type { ProfileSection } from '../stores/profile'

export const PROFILE_STEPS = [
  { id: 'basics', title: 'You & location', description: 'Contact details, region and how you want to work.' },
  { id: 'academics', title: 'Academics', description: 'Where and what you study.' },
  { id: 'skills', title: 'Skills', description: 'Tools and skills companies match against.' },
  { id: 'availability', title: 'Availability', description: 'When you can start and for how long.' },
  { id: 'documents', title: 'Documents', description: 'Your CV and optional introductory letter.' },
] as const

export type StepId = (typeof PROFILE_STEPS)[number]['id']

export const SECTION_STEP: Record<ProfileSection['id'], StepId> = {
  basics: 'basics',
  location: 'basics',
  academics: 'academics',
  skills: 'skills',
  availability: 'availability',
  documents: 'documents',
}

export type StepErrors = Partial<Record<string, string>>

/** Returns field-id → message for the fields on a step that block "Continue". */
export function validateStep(step: StepId, p: StudentProfile): StepErrors {
  const errors: StepErrors = {}
  switch (step) {
    case 'basics':
      if (!p.fullName.trim()) errors.fullName = 'Enter your full name.'
      if (!p.email.trim()) errors.email = 'Enter your email address.'
      else if (!/^\S+@\S+\.\S+$/.test(p.email.trim())) errors.email = 'Enter an email like name@university.edu.gh.'
      if (p.phone && !/^\+?[\d\s-]{9,15}$/.test(p.phone.trim())) errors.phone = 'Enter a phone number like 024 123 4567.'
      if (!p.region) errors.region = 'Choose the region you live or study in.'
      if (!p.workModes.length) errors.workModes = 'Choose at least one work mode.'
      break
    case 'academics':
      if (!p.institution.trim()) errors.institution = 'Enter your institution.'
      if (!p.program.trim()) errors.program = 'Enter your programme or major.'
      if (!p.level) errors.level = 'Choose your academic level.'
      break
    case 'skills':
      if (p.skills.length < 3) errors.skills = `Add at least 3 skills (${p.skills.length} added).`
      break
    case 'availability':
      if (!p.availableFrom) errors.availableFrom = 'Choose the month you can start.'
      if (!p.availableTo) errors.availableTo = 'Choose the last month you are available.'
      else if (p.availableFrom && p.availableTo < p.availableFrom) errors.availableTo = 'End month must be after the start month.'
      break
    case 'documents':
      if (!p.cv) errors.cv = 'Upload your CV to apply directly.'
      break
  }
  return errors
}
