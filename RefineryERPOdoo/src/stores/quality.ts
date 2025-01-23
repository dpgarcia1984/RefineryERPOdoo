import { defineStore } from 'pinia'
import { supabase } from '../lib/supabaseClient'

interface Document {
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
}

interface Process {
  id: string
  code: string
  name: string
  description: string
  owner_id: string
}

interface Indicator {
  id: string
  process_id: string
  name: string
  description: string
  target_value: number
  unit: string
  frequency: string
}

interface Audit {
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

interface NonConformity {
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

export const useQualityStore = defineStore('quality', {
  state: () => ({
    documents: [] as Document[],
    processes: [] as Process[],
    indicators: [] as Indicator[],
    audits: [] as Audit[],
    nonConformities: [] as NonConformity[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchDocuments() {
      try {
        this.loading = true
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('status', 'published')
        
        if (error) throw error
        
        this.documents = data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async fetchProcesses() {
      try {
        this.loading = true
        const { data, error } = await supabase
          .from('processes')
          .select('*')
        
        if (error) throw error
        
        this.processes = data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async fetchProcessIndicators(processId?: string) {
      try {
        this.loading = true
        let query = supabase
          .from('process_indicators')
          .select('*')
        
        if (processId) {
          query = query.eq('process_id', processId)
        }
        
        const { data, error } = await query
        
        if (error) throw error
        
        this.indicators = data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async fetchAudits() {
      try {
        this.loading = true
        const { data, error } = await supabase
          .from('audits')
          .select('*, area:areas(name)')
        
        if (error) throw error
        
        this.audits = data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async createAudit(audit: Omit<Audit, 'id' | 'code'>) {
      const { data, error } = await supabase
        .from('audits')
        .insert([audit])
        .select()
      
      if (error) throw error
      return data[0]
    },

    async updateAudit(id: string, audit: Partial<Audit>) {
      const { data, error } = await supabase
        .from('audits')
        .update(audit)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    },

    async fetchNonConformities() {
      try {
        this.loading = true
        const { data, error } = await supabase
          .from('non_conformities')
          .select('*, process:processes(name)')
        
        if (error) throw error
        
        this.nonConformities = data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async createNonConformity(nonConformity: Omit<NonConformity, 'id' | 'code'>) {
      const { data, error } = await supabase
        .from('non_conformities')
        .insert([nonConformity])
        .select()
      
      if (error) throw error
      return data[0]
    },

    async updateNonConformity(id: string, nonConformity: Partial<NonConformity>) {
      const { data, error } = await supabase
        .from('non_conformities')
        .update(nonConformity)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    }
  }
})