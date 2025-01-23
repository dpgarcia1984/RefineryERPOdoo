<template>
  <quality-layout>
    <div class="audit-list">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Auditorías</h2>
        <button class="btn btn-primary" @click="showCreateModal = true">
          <i class="fas fa-plus"></i> Nueva Auditoría
        </button>
      </div>

      <div class="row mb-4">
        <div class="col-6 col-md-3">
          <quality-metric
            title="Planificadas"
            :value="plannedAudits.length"
            bg-color="bg-info"
          />
        </div>
        <div class="col-6 col-md-3">
          <quality-metric
            title="En Progreso"
            :value="inProgressAudits.length"
            bg-color="bg-warning"
          />
        </div>
        <div class="col-6 col-md-3">
          <quality-metric
            title="Completadas"
            :value="completedAudits.length"
            bg-color="bg-success"
          />
        </div>
        <div class="col-6 col-md-3">
          <quality-metric
            title="Vencidas"
            :value="overdueAudits.length"
            bg-color="bg-danger"
          />
        </div>
      </div>

      <quality-card
        title="Lista de Auditorías"
        description="Gestión y seguimiento de auditorías internas y externas"
      >
        <quality-table
          :columns="columns"
          :items="audits"
          :actions="tableActions"
          :badge-classes="badgeClasses"
        />
      </quality-card>

      <!-- Modal de Auditoría -->
      <div class="modal fade" :class="{ show: showCreateModal }" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ editingAudit ? 'Editar' : 'Crear' }} Auditoría</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveAudit">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Tipo de Auditoría</label>
                    <select v-model="auditForm.type" class="form-select" required>
                      <option value="internal">Interna</option>
                      <option value="external">Externa</option>
                      <option value="supplier">Proveedor</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Área</label>
                    <select v-model="auditForm.area_id" class="form-select" required>
                      <option v-for="area in areas" :key="area.id" :value="area.id">
                        {{ area.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Fecha Planificada</label>
                    <input v-model="auditForm.planned_date" type="date" class="form-control" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Estado</label>
                    <select v-model="auditForm.status" class="form-select" required>
                      <option value="planned">Planificada</option>
                      <option value="in_progress">En Progreso</option>
                      <option value="completed">Completada</option>
                    </select>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Hallazgos</label>
                  <textarea v-model="auditForm.findings" class="form-control" rows="4"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">Recomendaciones</label>
                  <textarea v-model="auditForm.recommendations" class="form-control" rows="4"></textarea>
                </div>
                <div class="text-end">
                  <button type="button" class="btn btn-secondary me-2" @click="closeModal">Cancelar</button>
                  <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </quality-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQualityStore } from '../store'
import QualityLayout from '../layouts/QualityLayout.vue'
import QualityCard from '../components/QualityCard.vue'
import QualityTable from '../components/QualityTable.vue'
import QualityMetric from '../components/QualityMetric.vue'
import type { Audit, Area } from '../types'

const qualityStore = useQualityStore()
const showCreateModal = ref(false)
const editingAudit = ref<Audit | null>(null)
const audits = ref<Audit[]>([])
const areas = ref<Area[]>([])

const auditForm = ref({
  type: 'internal',
  area_id: '',
  planned_date: '',
  status: 'planned',
  findings: '',
  recommendations: ''
})

const columns = [
  { key: 'code', label: 'Código' },
  { key: 'type', label: 'Tipo' },
  { key: 'area.name', label: 'Área' },
  { key: 'planned_date', label: 'Fecha Planificada' },
  { key: 'status', label: 'Estado', type: 'badge' }
]

const tableActions = [
  {
    name: 'view',
    icon: 'fas fa-eye',
    class: 'btn-outline-primary',
    handler: viewAudit
  },
  {
    name: 'edit',
    icon: 'fas fa-edit',
    class: 'btn-outline-secondary',
    handler: editAudit
  }
]

const badgeClasses = {
  planned: 'bg-info',
  in_progress: 'bg-warning',
  completed: 'bg-success'
}

const plannedAudits = computed(() => 
  audits.value.filter(a => a.status === 'planned')
)

const inProgressAudits = computed(() => 
  audits.value.filter(a => a.status === 'in_progress')
)

const completedAudits = computed(() => 
  audits.value.filter(a => a.status === 'completed')
)

const overdueAudits = computed(() => 
  audits.value.filter(a => {
    return a.status === 'planned' && new Date(a.planned_date) < new Date()
  })
)

const closeModal = () => {
  showCreateModal.value = false
  editingAudit.value = null
  auditForm.value = {
    type: 'internal',
    area_id: '',
    planned_date: '',
    status: 'planned',
    findings: '',
    recommendations: ''
  }
}

function editAudit(audit: Audit) {
  editingAudit.value = audit
  auditForm.value = { ...audit }
  showCreateModal.value = true
}

function viewAudit(audit: Audit) {
  // Implementar visor de auditoría
  console.log('Ver auditoría:', audit)
}

const saveAudit = async () => {
  try {
    if (editingAudit.value) {
      await qualityStore.updateAudit(editingAudit.value.id, auditForm.value)
    } else {
      await qualityStore.createAudit(auditForm.value)
    }
    closeModal()
    await loadAudits()
  } catch (error) {
    console.error('Error al guardar auditoría:', error)
  }
}

const loadAudits = async () => {
  await qualityStore.fetchAudits()
  audits.value = qualityStore.audits
}

onMounted(async () => {
  await loadAudits()
})
</script>

<style scoped>
.modal.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}

.audit-list {
  padding: 1rem;
}

@media (max-width: 768px) {
  .audit-list {
    padding: 0.5rem;
  }
}
</style>