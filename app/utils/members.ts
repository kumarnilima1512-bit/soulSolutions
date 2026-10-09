// utils/members.ts
// Shared types and helpers for the About page.

export interface Member {
  id: string
  name: string
  role: string
  department: 'psychiatry' | 'psychology' | ''
  type: 'founder' | 'mentor' | 'professional'
  qualifications: string
  experience_years: number | null
  institutions: string[]
  specializations: string[]
  bio: string | null
  photo_url: string | null
  order: number
}

export const departmentLabel = (d: Member['department']) =>
  d === 'psychiatry' ? 'Psychiatry' : d === 'psychology' ? 'Psychology' : ''

export const initials = (name: string) =>
  name
    .replace(/^(Dr|Ms|Mr|Mrs|Prof)\.?\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()