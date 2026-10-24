export interface SRun {
  text: string
  bold: boolean
  italic: boolean
  code: boolean
  href: string | null
}

export interface SBlock {
  id: string
  type: string
  runs?: SRun[]
  url?: string | null
  caption?: string
  icon?: string | null
  children?: SBlock[]
}