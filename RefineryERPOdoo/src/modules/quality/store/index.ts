import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'
import type { Document, Process, Indicator, Audit, NonConformity } from '../types'

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
    // Documentos
    async fetchDocuments() {
      try {
        this.loading = true
        const { data, error } = await supabase
          .from('documents')
          .select('*, type:document_types(name)')
          .order('updated_at', { ascending: false })
        
        if (error) throw error
        this.documents = data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    // Procesos
    async fetchProcesses() {
      try {
        this.loading = true
        const { data, error } = await supabase
          .from('processes')
          .select('*')
          .order('name')
        
        if (error) throw error
        this.processes = data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    // Indicadores
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

    // Auditorías
    async fetchAudits() {
      try {
        this.loading = true
        const { data, error } = await supabase
          .from('audits')
          .select('*, area:areas(name)')
          .order('planned_date', { ascending: false })
        
        if (error) throw error
        this.audits = data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    // No conformidades
    async fetchNonConformities() {
      try {
        this.loading = true
        const { data, error } = await supabase
          .from('non_conformities')
          .select('*, process:processes(name)')
          .order('detection_date', { ascending: false })
        
        if (error) throw error
        this.nonConformities = data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})