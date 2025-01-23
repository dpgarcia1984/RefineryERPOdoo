<template>
  <div class="non-conformity-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Non-Conformities</h2>
      <button class="btn btn-primary" @click="showCreateModal = true">
        <i class="fas fa-plus"></i> New Non-Conformity
      </button>
    </div>

    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card bg-danger text-white">
          <div class="card-body">
            <h6 class="card-title">Open Issues</h6>
            <h2>{{ openIssues.length }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-warning text-white">
          <div class="card-body">
            <h6 class="card-title">In Progress</h6>
            <h2>{{ inProgressIssues.length }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-success text-white">
          <div class="card-body">
            <h6 class="card-title">Resolved</h6>
            <h2>{{ resolvedIssues.length }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-info text-white">
          <div class="card-body">
            <h6 class="card-title">Verified</h6>
            <h2>{{ verifiedIssues.length }}</h2>
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
                <th>Process</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Detection Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="issue in nonConformities" :key="issue.id">
                <td>{{ issue.code }}</td>
                <td>{{ issue.process?.name }}</td>
                <td>
                  <span :class="getSeverityBadgeClass(issue.severity)">
                    {{ issue.severity }}
                  </span>
                </td>
                <td>
                  <span :class="getStatusBadgeClass(issue.status)">
                    {{ issue.status }}
                  </span>
                </td>
                <td>{{ formatDate(issue.detection_date) }}</td>
                <td>
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" @click="viewIssue(issue)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" @click="editIssue(issue)">
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
            <h5 class="modal-title">{{ editingIssue ? 'Edit' : 'Create' }} Non-Conformity</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveIssue">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Process</label>
                  <select v-model="issueForm.process_id" class="form-select" required>
                    <option v-for="process in processes" :key="process.id" :value="process.id">
                      {{ process.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Severity</label>
                  <select v-model="issueForm.severity" class="form-select" required>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Detection Date</label>
                  <input v-model="issueForm.detection_date" type="date" class="form-control" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Status</label>
                  <select v-model="issueForm.status" class="form-select" required>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="verified">Verified</option>
                  </select>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea v-model="issueForm.description" class="form-control" rows="3" required></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Root Cause</label>
                <textarea v-model="issueForm.root_cause" class="form-control" rows="3"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Corrective Action</label>
                <textarea v-model="issueForm.corrective_action" class="form-control" rows="3"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Preventive Action</label>
                <textarea v-model="issueForm.preventive_action" class="form-control" rows="3"></textarea>
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

interface Process {
  id: string
  name: string
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

interface NonConformityForm {
  process_id: string
  severity: string
  status: string
  description: string
  detection_date: string
  root_cause: string
  corrective_action: string
  preventive_action: string
}

const qualityStore = useQualityStore()
const showCreateModal = ref(false)
const editingIssue = ref<NonConformity | null>(null)
const nonConformities = ref<NonConformity[]>([])
const processes = ref<Process[]>([])

const issueForm = ref<NonConformityForm>({
  process_id: '',
  severity: 'medium',
  status: 'open',
  description: '',
  detection_date: '',
  root_cause: '',
  corrective_action: '',
  preventive_action: ''
})

const openIssues = computed(() => 
  nonConformities.value.filter(i => i.status === 'open')
)

const inProgressIssues = computed(() => 
  nonConformities.value.filter(i => i.status === 'in_progress')
)

const resolvedIssues = computed(() => 
  nonConformities.value.filter(i => i.status === 'resolved')
)

const verifiedIssues = computed(() => 
  nonConformities.value.filter(i => i.status === 'verified')
)

const getSeverityBadgeClass = (severity: string) => {
  const classes = {
    low: 'badge bg-success',
    medium: 'badge bg-warning',
    high: 'badge bg-danger',
    critical: 'badge bg-dark'
  }
  return classes[severity] || 'badge bg-secondary'
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    open: 'badge bg-danger',
    in_progress: 'badge bg-warning',
    resolved: 'badge bg-success',
    verified: 'badge bg-info'
  }
  return classes[status] || 'badge bg-secondary'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const closeModal = () => {
  showCreateModal.value = false
  editingIssue.value = null
  issueForm.value = {
    process_id: '',
    severity: 'medium',
    status: 'open',
    description: '',
    detection_date: '',
    root_cause: '',
    corrective_action: '',
    preventive_action: ''
  }
}

const editIssue = (issue: NonConformity) => {
  editingIssue.value = issue
  issueForm.value = { ...issue }
  showCreateModal.value = true
}

const viewIssue = (issue: NonConformity) => {
  // Implement issue viewer
}

const saveIssue = async () => {
  try {
    if (editingIssue.value) {
      await qualityStore.updateNonConformity(editingIssue.value.id, issueForm.value)
    } else {
      await qualityStore.createNonConformity(issueForm.value)
    }
    closeModal()
    await loadNonConformities()
  } catch (error) {
    console.error('Error saving non-conformity:', error)
  }
}

const loadNonConformities = async () => {
  await Promise.all([
    qualityStore.fetchNonConformities(),
    qualityStore.fetchProcesses()
  ])
  nonConformities.value = qualityStore.nonConformities
  processes.value = qualityStore.processes
}

onMounted(async () => {
  await loadNonConformities()
})
</script>

<style scoped>
.modal.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}

.non-conformity-list {
  padding: 1rem;
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}
</style>