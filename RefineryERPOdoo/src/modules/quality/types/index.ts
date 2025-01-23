// Tipos para el módulo de calidad
export interface Document {
  id: string
  code: string
  title: string
  content: string
  version: string
  status: string
  type_id: string
  area_id: string
  process_id: string
  created_at: string
  updated_at: string
  type?: {
    name: string
  }
}

export interface Process {
  id: string
  code: string
  name: string
  description: string
  owner_id: string
}

export interface Indicator {
  id: string
  process_id: string
  name: string
  description: string
  target_value: number
  unit: string
  frequency: string
}

export interface Audit {
  id: string
  code: string
  type: string
  status: string
  planned_date: string
  completion_date?: string
  area_id: string
  findings?: string
  recommendations?: string
  area?: {
    name: string
  }
}

export interface NonConformity {
  id: string
  code: string
  description: string
  status: string
  severity: string
  process_id: string
  detection_date: string
  root_cause?: string
  corrective_action?: string
  preventive_action?: string
  process?: {
    name: string
  }
}

export interface Area {
  id: string
  code: string
  name: string
  description?: string
}