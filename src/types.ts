export type WorkMode = 'onsite' | 'hybrid' | 'remote'
export type CompensationType = 'paid' | 'stipend' | 'unpaid'
export type AcademicLevel = 'Level 100' | 'Level 200' | 'Level 300' | 'Level 400' | 'Postgraduate'

export interface StoredDocument {
  name: string
  size: number
  type: string
  uploadedAt: string
}

export interface StudentProfile {
  fullName: string
  email: string
  phone: string
  region: string
  city: string
  commuteKm: number
  workModes: WorkMode[]
  institution: string
  program: string
  level: AcademicLevel | ''
  skills: string[]
  availableFrom: string
  availableTo: string
  durationWeeks: number
  cv: StoredDocument | null
  letter: StoredDocument | null
}

export interface Company {
  name: string
  verified: boolean
  industry: string
  about: string
  size: string
  founded: number
  website: string
  address: string
}

export interface Compensation {
  type: CompensationType
  min?: number
  max?: number
}

export interface ScreeningQuestion {
  id: string
  prompt: string
  kind: 'text' | 'choice'
  options?: string[]
  maxLength?: number
}

export interface Internship {
  id: string
  company: Company
  role: string
  summary: string
  responsibilities: string[]
  requiredSkills: string[]
  niceToHave: string[]
  workMode: WorkMode
  region: string
  city: string
  durationWeeks: number
  startMonth: string
  endMonth: string
  compensation: Compensation
  deadline: string
  postedAt: string
  levels: AcademicLevel[]
  openings: number
  responseDays: number
  questions: ScreeningQuestion[]
}

export type MatchLevel = 'full' | 'partial' | 'none' | 'unknown'
export type MatchKey = 'region' | 'skills' | 'window' | 'mode' | 'level'

export interface MatchReason {
  key: MatchKey
  level: MatchLevel
  label: string
  detail: string
}

export interface MatchResult {
  score: number
  reasons: MatchReason[]
  matchedSkills: string[]
  missingSkills: string[]
}

export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'shortlisted'
  | 'interview'
  | 'offer'
  | 'closed'

export interface Application {
  id: string
  internshipId: string
  companyName: string
  role: string
  region: string
  city: string
  appliedAt: string
  updatedAt: string
  status: ApplicationStatus
  cvName: string
  letterName: string | null
  note: string
  answers: Record<string, string>
  responseDays: number
  sample?: boolean
}
