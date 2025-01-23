<template>
  <div class="process-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Business Processes</h2>
      <button class="btn btn-primary" @click="showCreateModal = true">
        <i class="fas fa-plus"></i> New Process
      </button>
    </div>

    <div class="row">
      <div class="col-md-4" v-for="process in processes" :key="process.id">
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">{{ process.name }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">{{ process.code }}</h6>
            <p class="card-text">{{ process.description }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <button class="btn btn-sm btn-outline-primary" @click="viewKPIs(process)">
                View KPIs
              </button>
              <button class="btn btn-sm btn-outline-secondary" @click="editProcess(process)">
                <i class="fas fa-edit"></i> Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div class="modal fade" :class="{ show: showCreateModal }" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingProcess ? 'Edit' : 'Create' }} Process</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProcess">
              <div class="mb-3">
                <label class="form-label">Process Code</label>
                <input v-model="processForm.code" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input v-model="processForm.name" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea v-model="processForm.description" class="form-control" rows="3"></textarea>
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

    <!-- KPIs Modal -->
    <div class="modal fade" :class="{ show: showKPIsModal }" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Process KPIs</h5>
            <button type="button" class="btn-close" @click="closeKPIsModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <button class="btn btn-sm btn-primary" @click="showAddKPIForm = true">
                <i class="fas fa-plus"></i> Add KPI
              </button>
            </div>
            
            <div v-if="showAddKPIForm" class="card mb-3">
              <div class="card-body">
                <form @submit.prevent="saveKPI">
                  <div class="mb-3">
                    <label class="form-label">KPI Name</label>
                    <input v-model="kpiForm.name" type="text" class="form-control" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Target Value</label>
                    <input v-model="kpiForm.target_value" type="number" class="form-control" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Unit</label>
                    <input v-model="kpiForm.unit" type="text" class="form-control" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Frequency</label>
                    <select v-model="kpiForm.frequency" class="form-select" required>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div class="text-end">
                    <button type="button" class="btn btn-secondary me-2" @click="showAddKPIForm = false">
                      Cancel
                    </button>
                    <button type="submit" class="btn btn-primary">Save KPI</button>
                  </div>
                </form>
              </div>
            </div>

            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Target</th>
                  <th>Unit</th>
                  <th>Frequency</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="kpi in processKPIs" :key="kpi.id">
                  <td>{{ kpi.name }}</td>
                  <td>{{ kpi.target_value }}</td>
                  <td>{{ kpi.unit }}</td>
                  <td>{{ kpi.frequency }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteKPI(kpi)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQualityStore } from '@/stores/quality'

const qualityStore = useQualityStore()
const showCreateModal = ref(false)
const showKPIsModal = ref(false)
const showAddKPIForm = ref(false)
const editingProcess = ref(null)
const selectedProcess = ref(null)
const processes = ref([])
const processKPIs = ref([])

const processForm = ref({
  code: '',
  name: '',
  description: ''
})

const kpiForm = ref({
  name: '',
  target_value: 0,
  unit: '',
  frequency: 'monthly'
})

const closeModal = () => {
  showCreateModal.value = false
  editingProcess.value = null
  processForm.value = {
    code: '',
    name: '',
    description: ''
  }
}

const closeKPIsModal = () => {
  showKPIsModal.value = false
  showAddKPIForm.value = false
  selectedProcess.value = null
  processKPIs.value = []
}

const editProcess = (process) => {
  editingProcess.value = process
  processForm.value = { ...process }
  showCreateModal.value = true
}

const viewKPIs = async (process) => {
  selectedProcess.value = process
  await qualityStore.fetchProcessIndicators(process.id)
  processKPIs.value = qualityStore.indicators
  showKPIsModal.value = true
}

const saveProcess = async () => {
  try {
    if (editingProcess.value) {
      await qualityStore.updateProcess(editingProcess.value.id, processForm.value)
    } else {
      await qualityStore.createProcess(processForm.value)
    }
    closeModal()
    await loadProcesses()
  } catch (error) {
    console.error('Error saving process:', error)
  }
}

const saveKPI = async () => {
  try {
    await qualityStore.createProcessIndicator({
      ...kpiForm.value,
      process_id: selectedProcess.value.id
    })
    showAddKPIForm.value = false
    kpiForm.value = {
      name: '',
      target_value: 0,
      unit: '',
      frequency: 'monthly'
    }
    await viewKPIs(selectedProcess.value)
  } catch (error) {
    console.error('Error saving KPI:', error)
  }
}

const deleteKPI = async (kpi) => {
  if (confirm('Are you sure you want to delete this KPI?')) {
    try {
      await qualityStore.deleteProcessIndicator(kpi.id)
      await viewKPIs(selectedProcess.value)
    } catch (error) {
      console.error('Error deleting KPI:', error)
    }
  }
}

const loadProcesses = async () => {
  await qualityStore.fetchProcesses()
  processes.value = qualityStore.processes
}

onMounted(async () => {
  await loadProcesses()
})
</script>

<style scoped>
.modal.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}

.process-list {
  padding: 1rem;
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}
</style>