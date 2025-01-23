<template>
  <div class="audit-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Quality Audits</h2>
      <button class="btn btn-primary" @click="showCreateModal = true">
        <i class="fas fa-plus"></i> New Audit
      </button>
    </div>

    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card bg-info text-white">
          <div class="card-body">
            <h6 class="card-title">Planned Audits</h6>
            <h2>{{ plannedAudits.length }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-warning text-white">
          <div class="card-body">
            <h6 class="card-title">In Progress</h6>
            <h2>{{ inProgressAudits.length }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-success text-white">
          <div class="card-body">
            <h6 class="card-title">Completed</h6>
            <h2>{{ completedAudits.length }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-danger text-white">
          <div class="card-body">
            <h6 class="card-title">Overdue</h6>
            <h2>{{ overdueAudits.length }}</h2>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Area</th>
                <th>Planned Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="audit in audits" :key="audit.id">
                <td>{{ audit.code }}</td>
                <td>{{ audit.type }}</td>
                <td>{{ audit.area?.name }}</td>
                <td>{{ formatDate(audit.planned_date) }}</td>
                <td>
                  <span :class="getStatusBadgeClass(audit.status)">
                    {{ audit.status }}
                  </span>
                </td>
                <td>
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" @click="viewAudit(audit)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" @click="editAudit(audit)">
                      <i class="fas fa-edit"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div class="modal fade" :class="{ show: showCreateModal }" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingAudit ? 'Edit' : 'Create' }} Audit</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveAudit">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Audit Type</label>
                  <select v-model="auditForm.type" class="form-select" required>
                    <option value="internal">Internal</option>
                    <option value="external">External</option>
                    <option value="supplier">Supplier</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Area</label>
                  <select v-model="auditForm.area_id" class="form-select" required>
                    <option v-for="area in areas" :key="area.id" :value="area.id">
                      {{ area.name }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Planned Date</label>
                  <input v-model="auditForm.planned_date" type="date" class="form-control" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Status</label>
                  <select v-model="auditForm.status" class="form-select" required>
                    <option value="planned">Planned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Findings</label>
                <textarea v-model="auditForm.findings" class="form-control" rows="4"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Recommendations</label>
                <textarea v-model="auditForm.recommendations" class="form-control" rows="4"></textarea>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" @click="closeModal">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQualityStore } from '@/stores/quality'

interface Area {
  id: string
  name: string
}

interface Audit {
  id: string
  code: string
  type: string
  status: string
  planned_date: string
  area_id: string
  findings?: string
  recommendations?: string
  area?: {
    name: string
  }
}

interface AuditForm {
  type: string
  area_id: string
  planned_date: string
  status: string
  findings: string
  recommendations: string
}

const qualityStore = useQualityStore()
const showCreateModal = ref(false)
const editingAudit = ref<Audit | null>(null)
const audits = ref<Audit[]>([])
const areas = ref<Area[]>([])

const auditForm = ref<AuditForm>({
  type: 'internal',
  area_id: '',
  planned_date: '',
  status: 'planned',
  findings: '',
  recommendations: ''
})

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

const getStatusBadgeClass = (status: string) => {
  const classes = {
    planned: 'badge bg-info',
    in_progress: 'badge bg-warning',
    completed: 'badge bg-success'
  }
  return classes[status] || 'badge bg-secondary'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

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

const editAudit = (audit) => {
  editingAudit.value = audit
  auditForm.value = { ...audit }
  showCreateModal.value = true
}

const viewAudit = (audit) => {
  // Implement audit viewer
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
    console.error('Error saving audit:', error)
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

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}
</style>