import type { AcademicLevel, CompensationType, WorkMode } from '../types'

export const REGIONS = [
  'Ahafo',
  'Ashanti',
  'Bono',
  'Bono East',
  'Central',
  'Eastern',
  'Greater Accra',
  'North East',
  'Northern',
  'Oti',
  'Savannah',
  'Upper East',
  'Upper West',
  'Volta',
  'Western',
  'Western North',
] as const

/** Regions sharing a border, used to suggest "nearby" roles. */
export const NEIGHBOURING_REGIONS: Record<string, string[]> = {
  Ahafo: ['Ashanti', 'Bono', 'Western North'],
  Ashanti: ['Ahafo', 'Bono', 'Bono East', 'Central', 'Eastern', 'Western North'],
  Bono: ['Ahafo', 'Ashanti', 'Bono East', 'Savannah', 'Western North'],
  'Bono East': ['Ashanti', 'Bono', 'Eastern', 'Northern', 'Oti', 'Savannah'],
  Central: ['Ashanti', 'Eastern', 'Greater Accra', 'Western', 'Western North'],
  Eastern: ['Ashanti', 'Bono East', 'Central', 'Greater Accra', 'Oti', 'Volta'],
  'Greater Accra': ['Central', 'Eastern', 'Volta'],
  'North East': ['Northern', 'Upper East'],
  Northern: ['Bono East', 'North East', 'Oti', 'Savannah', 'Upper East'],
  Oti: ['Bono East', 'Eastern', 'Northern', 'Volta'],
  Savannah: ['Bono', 'Bono East', 'Northern', 'Upper West'],
  'Upper East': ['North East', 'Northern', 'Upper West'],
  'Upper West': ['Savannah', 'Upper East'],
  Volta: ['Eastern', 'Greater Accra', 'Oti'],
  Western: ['Central', 'Western North'],
  'Western North': ['Ahafo', 'Ashanti', 'Bono', 'Central', 'Western'],
}

export const WORK_MODES: { value: WorkMode; label: string }[] = [
  { value: 'onsite', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'remote', label: 'Remote' },
]

export const COMPENSATION_TYPES: { value: CompensationType; label: string }[] = [
  { value: 'paid', label: 'Paid' },
  { value: 'stipend', label: 'Stipend' },
  { value: 'unpaid', label: 'Unpaid' },
]

export const ACADEMIC_LEVELS: AcademicLevel[] = [
  'Level 100',
  'Level 200',
  'Level 300',
  'Level 400',
  'Postgraduate',
]

export const INSTITUTIONS = [
  'University of Ghana',
  'Kwame Nkrumah University of Science and Technology',
  'University of Cape Coast',
  'University of Education, Winneba',
  'Ashesi University',
  'Ghana Institute of Management and Public Administration',
  'University for Development Studies',
  'University of Mines and Technology',
  'University of Health and Allied Sciences',
  'Accra Technical University',
  'Kumasi Technical University',
  'Takoradi Technical University',
]

export const PROGRAMS = [
  'Computer Science',
  'Information Technology',
  'Computer Engineering',
  'Electrical and Electronic Engineering',
  'Mechanical Engineering',
  'Business Administration',
  'Accounting',
  'Economics',
  'Marketing',
  'Statistics',
  'Actuarial Science',
  'Communication Studies',
  'Graphic Design',
  'Agricultural Science',
  'Public Health',
  'Supply Chain Management',
]

export const SKILLS = [
  'Python',
  'JavaScript',
  'TypeScript',
  'Vue.js',
  'React',
  'Node.js',
  'SQL',
  'Excel',
  'Power BI',
  'Tableau',
  'R',
  'Data Analysis',
  'Machine Learning',
  'Java',
  'Kotlin',
  'Flutter',
  'Git',
  'Linux',
  'Networking',
  'Cloud (AWS)',
  'Figma',
  'UI Design',
  'Adobe Illustrator',
  'Copywriting',
  'Social Media',
  'SEO',
  'Financial Modelling',
  'Bookkeeping',
  'QuickBooks',
  'Customer Service',
  'Project Management',
  'Research',
  'Public Speaking',
  'AutoCAD',
  'MATLAB',
  'GIS',
  'Inventory Management',
  'Survey Design',
]

export const DURATIONS = [8, 12, 16, 24]

export const DEADLINE_WINDOWS = [
  { value: 'any', label: 'Any deadline' },
  { value: '7', label: 'Closing in 7 days' },
  { value: '14', label: 'Closing in 14 days' },
  { value: '30', label: 'Closing in 30 days' },
] as const
