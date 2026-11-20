import type { AcademicLevel, Compensation, Company, Internship, ScreeningQuestion, WorkMode } from '../types'
import { addMonths, monthKey } from '../lib/format'

/**
 * Sample listings. Dates are expressed as offsets from today so deadlines
 * and internship windows stay realistic whenever the prototype is opened.
 */
interface Seed {
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
  startInMonths: number
  compensation: Compensation
  deadlineInDays: number
  postedDaysAgo: number
  levels: AcademicLevel[]
  openings: number
  responseDays: number
  questions: ScreeningQuestion[]
}

const ALL_UNDERGRAD: AcademicLevel[] = ['Level 200', 'Level 300', 'Level 400']
const SENIOR: AcademicLevel[] = ['Level 300', 'Level 400', 'Postgraduate']

const motivation = (company: string): ScreeningQuestion => ({
  id: 'motivation',
  prompt: `Why do you want to intern at ${company}?`,
  kind: 'text',
  maxLength: 400,
})

const seeds: Seed[] = [
  {
    id: 'ayo-pay-backend',
    company: {
      name: 'Ayo Pay',
      verified: true,
      industry: 'Fintech',
      about:
        'Ayo Pay builds mobile-money infrastructure that lets small merchants across West Africa accept payments, settle daily, and access working capital.',
      size: '51–200 employees',
      founded: 2019,
      website: 'ayopay.example.com',
      address: '14 Liberation Road, Airport Residential, Accra',
    },
    role: 'Backend Engineering Intern',
    summary:
      'Join the payments platform team to build and test APIs that process thousands of mobile-money transactions every day.',
    responsibilities: [
      'Build and document REST endpoints for merchant settlement reports',
      'Write unit and integration tests for transaction reconciliation jobs',
      'Pair with senior engineers during code review and incident retrospectives',
      'Present a demo of your shipped feature at the end of the internship',
    ],
    requiredSkills: ['Node.js', 'TypeScript', 'SQL', 'Git'],
    niceToHave: ['Cloud (AWS)', 'Linux'],
    workMode: 'hybrid',
    region: 'Greater Accra',
    city: 'Accra',
    durationWeeks: 12,
    startInMonths: 2,
    compensation: { type: 'paid', min: 2500, max: 3500 },
    deadlineInDays: 9,
    postedDaysAgo: 4,
    levels: SENIOR,
    openings: 3,
    responseDays: 10,
    questions: [
      motivation('Ayo Pay'),
      {
        id: 'project',
        prompt: 'Share a link to a project or repository you are proud of.',
        kind: 'text',
        maxLength: 200,
      },
      {
        id: 'days',
        prompt: 'How many days per week can you be in the Accra office?',
        kind: 'choice',
        options: ['1 day', '2 days', '3 days', '4+ days'],
      },
    ],
  },
  {
    id: 'kente-analytics-data',
    company: {
      name: 'Kente Analytics',
      verified: true,
      industry: 'Data & Research',
      about:
        'Kente Analytics helps retailers and NGOs make decisions with clean, local data — from household surveys to point-of-sale dashboards.',
      size: '11–50 employees',
      founded: 2017,
      website: 'kenteanalytics.example.com',
      address: '3rd Floor, Adum Towers, Kumasi',
    },
    role: 'Data Analyst Intern',
    summary:
      'Clean survey data, build dashboards for retail clients, and help the research team turn numbers into clear recommendations.',
    responsibilities: [
      'Clean and validate survey datasets of 5,000+ respondents',
      'Build weekly Power BI dashboards for two retail clients',
      'Write short insight summaries for non-technical stakeholders',
    ],
    requiredSkills: ['SQL', 'Excel', 'Power BI', 'Data Analysis', 'Python'],
    niceToHave: ['R', 'Survey Design'],
    workMode: 'onsite',
    region: 'Ashanti',
    city: 'Kumasi',
    durationWeeks: 12,
    startInMonths: 1,
    compensation: { type: 'stipend', min: 1500, max: 1800 },
    deadlineInDays: 3,
    postedDaysAgo: 12,
    levels: ALL_UNDERGRAD,
    openings: 2,
    responseDays: 7,
    questions: [
      motivation('Kente Analytics'),
      {
        id: 'tools',
        prompt: 'Which tool do you use most often for analysis?',
        kind: 'choice',
        options: ['Excel', 'Python', 'R', 'Power BI', 'Other'],
      },
    ],
  },
  {
    id: 'volta-grid-electrical',
    company: {
      name: 'Volta Grid Solutions',
      verified: true,
      industry: 'Energy',
      about:
        'Volta Grid Solutions designs and maintains solar mini-grids for off-grid communities and agro-processing sites across eastern Ghana.',
      size: '201–500 employees',
      founded: 2012,
      website: 'voltagrid.example.com',
      address: 'Plot 22, Industrial Area, Ho',
    },
    role: 'Electrical Engineering Intern',
    summary:
      'Support field engineers with site surveys, load calculations and preventive maintenance on solar mini-grid installations.',
    responsibilities: [
      'Assist with load assessments and single-line diagrams for new sites',
      'Log maintenance readings and flag anomalies to the operations lead',
      'Prepare weekly site reports with photos and measurements',
    ],
    requiredSkills: ['AutoCAD', 'MATLAB', 'Excel'],
    niceToHave: ['Project Management', 'GIS'],
    workMode: 'onsite',
    region: 'Volta',
    city: 'Ho',
    durationWeeks: 16,
    startInMonths: 3,
    compensation: { type: 'paid', min: 2000, max: 2400 },
    deadlineInDays: 21,
    postedDaysAgo: 2,
    levels: SENIOR,
    openings: 4,
    responseDays: 14,
    questions: [
      motivation('Volta Grid Solutions'),
      {
        id: 'travel',
        prompt: 'Are you comfortable travelling to rural field sites up to 3 days a week?',
        kind: 'choice',
        options: ['Yes', 'Yes, with notice', 'No'],
      },
    ],
  },
  {
    id: 'harvest-link-agritech',
    company: {
      name: 'HarvestLink',
      verified: true,
      industry: 'Agritech',
      about:
        'HarvestLink connects smallholder farmers in the north to buyers and input suppliers through a USSD and mobile marketplace.',
      size: '11–50 employees',
      founded: 2020,
      website: 'harvestlink.example.com',
      address: 'Gumani Road, Tamale',
    },
    role: 'Product & Field Research Intern',
    summary:
      'Interview farmers and aggregators, synthesise findings, and help the product team prioritise features for the next season.',
    responsibilities: [
      'Run structured interviews with farmers and aggregators',
      'Synthesise findings into personas and journey maps',
      'Test USSD prototypes with users in the field',
    ],
    requiredSkills: ['Research', 'Survey Design', 'Excel'],
    niceToHave: ['Figma', 'Public Speaking'],
    workMode: 'hybrid',
    region: 'Northern',
    city: 'Tamale',
    durationWeeks: 12,
    startInMonths: 2,
    compensation: { type: 'stipend', min: 1200 },
    deadlineInDays: 14,
    postedDaysAgo: 6,
    levels: ALL_UNDERGRAD,
    openings: 2,
    responseDays: 10,
    questions: [
      motivation('HarvestLink'),
      {
        id: 'languages',
        prompt: 'Which local languages do you speak besides English?',
        kind: 'text',
        maxLength: 120,
      },
    ],
  },
  {
    id: 'coastline-media-design',
    company: {
      name: 'Coastline Media',
      verified: false,
      industry: 'Media & Design',
      about:
        'Coastline Media is a creative studio producing brand identities, campaigns and social content for hospitality and tourism clients.',
      size: '11–50 employees',
      founded: 2016,
      website: 'coastlinemedia.example.com',
      address: 'Victoria Road, Cape Coast',
    },
    role: 'Graphic & Social Design Intern',
    summary:
      'Design social campaigns and brand assets for hotel and tourism clients alongside the studio’s senior designers.',
    responsibilities: [
      'Produce social media graphics for 3–4 client accounts each week',
      'Contribute concepts to client pitch decks',
      'Maintain brand asset libraries in Figma',
    ],
    requiredSkills: ['Figma', 'Adobe Illustrator', 'Social Media'],
    niceToHave: ['Copywriting', 'UI Design'],
    workMode: 'onsite',
    region: 'Central',
    city: 'Cape Coast',
    durationWeeks: 8,
    startInMonths: 1,
    compensation: { type: 'unpaid' },
    deadlineInDays: 5,
    postedDaysAgo: 9,
    levels: ['Level 100', 'Level 200', 'Level 300', 'Level 400'],
    openings: 1,
    responseDays: 7,
    questions: [
      {
        id: 'portfolio',
        prompt: 'Link to your portfolio (Behance, Dribbble, Google Drive, etc.)',
        kind: 'text',
        maxLength: 200,
      },
    ],
  },
  {
    id: 'osu-telecom-network',
    company: {
      name: 'Osu Telecom',
      verified: true,
      industry: 'Telecommunications',
      about:
        'Osu Telecom operates fibre and fixed-wireless broadband for homes and businesses in southern Ghana.',
      size: '500+ employees',
      founded: 2008,
      website: 'osutelecom.example.com',
      address: 'Oxford Street, Osu, Accra',
    },
    role: 'Network Operations Intern',
    summary:
      'Monitor network health, assist with fibre deployments, and learn how a national ISP keeps customers online.',
    responsibilities: [
      'Monitor NOC dashboards and escalate incidents',
      'Assist field teams with fibre splicing and customer installs',
      'Document configuration changes in the knowledge base',
    ],
    requiredSkills: ['Networking', 'Linux', 'Customer Service'],
    niceToHave: ['Python', 'Cloud (AWS)'],
    workMode: 'onsite',
    region: 'Greater Accra',
    city: 'Accra',
    durationWeeks: 24,
    startInMonths: 2,
    compensation: { type: 'paid', min: 1800, max: 2200 },
    deadlineInDays: 27,
    postedDaysAgo: 1,
    levels: SENIOR,
    openings: 6,
    responseDays: 14,
    questions: [
      motivation('Osu Telecom'),
      {
        id: 'shifts',
        prompt: 'Can you work occasional weekend shifts?',
        kind: 'choice',
        options: ['Yes', 'Occasionally', 'No'],
      },
    ],
  },
  {
    id: 'bridge-health-public',
    company: {
      name: 'Bridge Health Initiative',
      verified: true,
      industry: 'Healthcare & NGO',
      about:
        'Bridge Health Initiative runs maternal and child health programmes with district health directorates in the Eastern and Volta regions.',
      size: '51–200 employees',
      founded: 2011,
      website: 'bridgehealth.example.org',
      address: 'Hospital Road, Koforidua',
    },
    role: 'Public Health Programme Intern',
    summary:
      'Support monitoring and evaluation for community health programmes, including data collection and report writing.',
    responsibilities: [
      'Collect and verify programme data from partner clinics',
      'Draft monthly monitoring reports for donors',
      'Help organise community health outreach events',
    ],
    requiredSkills: ['Research', 'Data Analysis', 'Excel', 'Public Speaking'],
    niceToHave: ['Survey Design', 'R'],
    workMode: 'hybrid',
    region: 'Eastern',
    city: 'Koforidua',
    durationWeeks: 12,
    startInMonths: 1,
    compensation: { type: 'stipend', min: 1000, max: 1300 },
    deadlineInDays: 11,
    postedDaysAgo: 5,
    levels: ALL_UNDERGRAD,
    openings: 3,
    responseDays: 10,
    questions: [motivation('Bridge Health Initiative')],
  },
  {
    id: 'sankofa-bank-finance',
    company: {
      name: 'Sankofa Bank',
      verified: true,
      industry: 'Banking & Finance',
      about:
        'Sankofa Bank is a commercial bank serving SMEs and retail customers through 40 branches and a growing digital platform.',
      size: '500+ employees',
      founded: 1998,
      website: 'sankofabank.example.com',
      address: 'Independence Avenue, Ridge, Accra',
    },
    role: 'Finance & Risk Intern',
    summary:
      'Rotate between credit risk and financial planning, building models that inform SME lending decisions.',
    responsibilities: [
      'Prepare credit analysis memos for SME loan applications',
      'Update monthly financial performance models',
      'Assist with regulatory reporting data checks',
    ],
    requiredSkills: ['Financial Modelling', 'Excel', 'Data Analysis'],
    niceToHave: ['SQL', 'Power BI'],
    workMode: 'onsite',
    region: 'Greater Accra',
    city: 'Accra',
    durationWeeks: 12,
    startInMonths: 3,
    compensation: { type: 'paid', min: 2800, max: 3200 },
    deadlineInDays: 18,
    postedDaysAgo: 3,
    levels: SENIOR,
    openings: 5,
    responseDays: 21,
    questions: [
      motivation('Sankofa Bank'),
      {
        id: 'cgpa',
        prompt: 'What is your current CWA / CGPA?',
        kind: 'text',
        maxLength: 20,
      },
    ],
  },
  {
    id: 'pixelforge-frontend',
    company: {
      name: 'PixelForge Studio',
      verified: true,
      industry: 'Software',
      about:
        'PixelForge is a fully remote product studio building web and mobile apps for clients in Ghana, Nigeria and the UK.',
      size: '11–50 employees',
      founded: 2018,
      website: 'pixelforge.example.com',
      address: 'Remote-first · registered in East Legon, Accra',
    },
    role: 'Frontend Developer Intern',
    summary:
      'Build accessible, well-tested UI components for client web apps using Vue and TypeScript.',
    responsibilities: [
      'Implement UI components from Figma designs',
      'Write component tests and fix accessibility issues',
      'Join daily stand-ups and fortnightly client demos',
    ],
    requiredSkills: ['JavaScript', 'TypeScript', 'Vue.js', 'Git', 'Figma'],
    niceToHave: ['React', 'UI Design'],
    workMode: 'remote',
    region: 'Greater Accra',
    city: 'Remote',
    durationWeeks: 12,
    startInMonths: 1,
    compensation: { type: 'paid', min: 2200, max: 3000 },
    deadlineInDays: 7,
    postedDaysAgo: 8,
    levels: ['Level 200', 'Level 300', 'Level 400', 'Postgraduate'],
    openings: 2,
    responseDays: 7,
    questions: [
      {
        id: 'github',
        prompt: 'Link to your GitHub profile or a live project.',
        kind: 'text',
        maxLength: 200,
      },
      {
        id: 'hours',
        prompt: 'How many hours per week can you commit?',
        kind: 'choice',
        options: ['Under 20', '20–30', '30–40'],
      },
    ],
  },
  {
    id: 'goldcoast-logistics',
    company: {
      name: 'GoldCoast Logistics',
      verified: true,
      industry: 'Logistics',
      about:
        'GoldCoast Logistics runs warehousing and freight forwarding out of Takoradi port for mining and FMCG clients.',
      size: '201–500 employees',
      founded: 2005,
      website: 'goldcoastlogistics.example.com',
      address: 'Harbour Road, Takoradi',
    },
    role: 'Supply Chain Intern',
    summary:
      'Track inbound shipments, reconcile warehouse stock, and help improve how the operations team plans deliveries.',
    responsibilities: [
      'Reconcile stock counts against the warehouse system weekly',
      'Track shipment milestones and flag delays',
      'Analyse delivery data to suggest route improvements',
    ],
    requiredSkills: ['Inventory Management', 'Excel', 'Data Analysis'],
    niceToHave: ['SQL', 'Project Management'],
    workMode: 'onsite',
    region: 'Western',
    city: 'Takoradi',
    durationWeeks: 16,
    startInMonths: 2,
    compensation: { type: 'stipend', min: 1400, max: 1600 },
    deadlineInDays: 16,
    postedDaysAgo: 10,
    levels: ALL_UNDERGRAD,
    openings: 3,
    responseDays: 10,
    questions: [motivation('GoldCoast Logistics')],
  },
  {
    id: 'adinkra-labs-ml',
    company: {
      name: 'Adinkra Labs',
      verified: true,
      industry: 'Software',
      about:
        'Adinkra Labs builds speech and language technology for Ghanaian languages, including Twi, Ewe, Ga and Dagbani.',
      size: '11–50 employees',
      founded: 2021,
      website: 'adinkralabs.example.com',
      address: 'KNUST Business School Incubator, Kumasi',
    },
    role: 'Machine Learning Research Intern',
    summary:
      'Help prepare speech datasets and run training experiments for Ghanaian-language speech recognition models.',
    responsibilities: [
      'Clean and label audio and text datasets',
      'Run and log model training experiments',
      'Summarise results in weekly research notes',
    ],
    requiredSkills: ['Python', 'Machine Learning', 'Git', 'Linux'],
    niceToHave: ['Research', 'Cloud (AWS)'],
    workMode: 'hybrid',
    region: 'Ashanti',
    city: 'Kumasi',
    durationWeeks: 16,
    startInMonths: 2,
    compensation: { type: 'paid', min: 2400, max: 2800 },
    deadlineInDays: 12,
    postedDaysAgo: 7,
    levels: SENIOR,
    openings: 2,
    responseDays: 14,
    questions: [
      motivation('Adinkra Labs'),
      {
        id: 'ml-project',
        prompt: 'Briefly describe a machine learning project you have worked on.',
        kind: 'text',
        maxLength: 400,
      },
    ],
  },
  {
    id: 'civic-voice-comms',
    company: {
      name: 'CivicVoice Ghana',
      verified: false,
      industry: 'Healthcare & NGO',
      about:
        'CivicVoice is a non-profit promoting youth participation in local governance through radio, social media and town halls.',
      size: '1–10 employees',
      founded: 2015,
      website: 'civicvoice.example.org',
      address: 'Remote · coordinated from Accra',
    },
    role: 'Communications Intern',
    summary:
      'Write and schedule social content, help produce a weekly radio segment, and grow CivicVoice’s youth audience.',
    responsibilities: [
      'Draft and schedule social posts across three platforms',
      'Research topics for a weekly radio segment',
      'Track engagement metrics and report monthly',
    ],
    requiredSkills: ['Copywriting', 'Social Media', 'Research'],
    niceToHave: ['SEO', 'Public Speaking'],
    workMode: 'remote',
    region: 'Greater Accra',
    city: 'Remote',
    durationWeeks: 8,
    startInMonths: 1,
    compensation: { type: 'unpaid' },
    deadlineInDays: 24,
    postedDaysAgo: 14,
    levels: ['Level 100', 'Level 200', 'Level 300', 'Level 400'],
    openings: 2,
    responseDays: 7,
    questions: [motivation('CivicVoice Ghana')],
  },
]

function toInternship(seed: Seed, today: Date): Internship {
  const thisMonth = monthKey(today)
  const startMonth = addMonths(thisMonth, seed.startInMonths)
  const endMonth = addMonths(startMonth, Math.max(1, Math.round(seed.durationWeeks / 4.33)) - 1)
  const deadline = new Date(today.getFullYear(), today.getMonth(), today.getDate() + seed.deadlineInDays, 23, 59)
  const posted = new Date(today.getFullYear(), today.getMonth(), today.getDate() - seed.postedDaysAgo, 9, 0)
  const { startInMonths, deadlineInDays, postedDaysAgo, ...rest } = seed
  return {
    ...rest,
    startMonth,
    endMonth,
    deadline: deadline.toISOString(),
    postedAt: posted.toISOString(),
  }
}

export const INTERNSHIPS: Internship[] = seeds.map((s) => toInternship(s, new Date()))

export const INDUSTRIES = [...new Set(INTERNSHIPS.map((i) => i.company.industry))].sort()

export function findInternship(id: string): Internship | undefined {
  return INTERNSHIPS.find((i) => i.id === id)
}
