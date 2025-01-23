<template>
  <quality-layout>
    <div class="process-list">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Procesos de Negocio</h2>
        <button class="btn btn-primary" @click="showCreateModal = true">
          <i class="fas fa-plus"></i> Nuevo Proceso
        </button>
      </div>

      <div class="row">
        <div class="col-12 col-md-6 col-lg-4" v-for="process in processes" :key="process.id">
          <quality-card
            :title="process.name"
            :description="process.description || 'Sin descripción'"
          >
            <div class="d-flex justify-content-between align-items-center mt-3">
              <small class="text-muted">Código: {{ process.code }}</small>
              <div class="btn-group">
                <button class="btn btn-sm btn-outline-primary" @click="viewKPIs(process)">
                  KPIs
                </button>
                <button class="btn btn-sm btn-outline-secondary" @click="editProcess(process)">
                  <i class="fas fa-edit"></i>
                </button>
              </div>
            </div>
          </quality-card>
        </div>
      </div>

      <!-- Modal de Proceso -->
      <div class="modal fade" :class="{ show: showCreateModal }" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ editingProcess ? 'Editar' : 'Crear' }} Proceso</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveProcess">
                <div class="mb-3">
                  <label class="form-label">Código del Proceso</label>
                  <input v-model="processForm.code" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Nombre</label>
                  <input v-model="processForm.name" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Descripción</label>
                  <textarea v-model="processForm.description" class="form-control" rows="3"></textarea>
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

      <!-- Modal de KPIs -->
      <div class="modal fade" :class="{ show: showKPIsModal }" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">KPIs del Proceso</h5>
              <button type="button" class="btn-close" @click="closeKPIsModal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <button class="btn btn-sm btn-primary" @click="showAddKPIForm = true">
                  <i class="fas fa-plus"></i> Agregar KPI
                </button>
              </div>
              
              <div v-if="showAddKPIForm" class="card mb-3">
                <div class="card-body">
                  <form @submit.prevent="saveKPI">
                    <div class="mb-3">
                      <label class="form-label">Nombre del KPI</label>
                      <input v-model="kpiForm.name" type="text" class="form-control" required>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Valor Objetivo</label>
                      <input v-model="kpiForm.target_value" type="number" class="form-control" required>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Unidad</label>
                      <input v-model="kpiForm.unit" type="text" class="form-control" required>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Frecuencia</label>
                      <select v-model="kpiForm.frequency" class="form-select" required>
                        <option value="daily">Diario</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensual</option>
                        <option value="quarterly">Trimestral</option>
                        <option value="yearly">Anual</option>
                      </select>
                    </div>
                    <div class="text-end">
                      <button type="button" class="btn btn-secondary me-2" @click="showAddKPIForm = false">
                        Cancelar
                      </button>
                      <button type="submit" class="btn btn-primary">Guardar KPI</button>
                    </div>
                  </form>
                </div>
              </div>

              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Objetivo</th>
                      <th>Unidad</th>
                      <th>Frecuencia</th>
                      <th>Acciones</th>
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
    </div>
  </quality-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQualityStore } from '../store'
import QualityLayout from '../layouts/QualityLayout.vue'
import QualityCard from '../components/QualityCard.vue'
import type { Process, Indicator } from '../types'

const qualityStore = useQualityStore()
const showCreateModal = ref(false)
const showKPIsModal = ref(false)
const showAddKPIForm = ref(false)
const editingProcess = ref<Process | null>(null)
const selectedProcess = ref<Process | null>(null)
const processes = ref<Process[]>([])
const processKPIs = ref<Indicator[]>([])

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

const editProcess = (process: Process) => {
  editingProcess.value = process
  processForm.value = { ...process }
  showCreateModal.value = true
}

const viewKPIs = async (process: Process) => {
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
    console.error('Error al guardar proceso:', error)
  }
}

const saveKPI = async () => {
  try {
    if (!selectedProcess.value) return
    
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
    console.error('Error al guardar KPI:', error)
  }
}

const deleteKPI = async (kpi: Indicator) => {
  if (!confirm('¿Está seguro de eliminar este KPI?')) return
  
  try {
    await qualityStore.deleteProcessIndicator(kpi.id)
    if (selectedProcess.value) {
      await viewKPIs(selectedProcess.value)
    }
  } catch (error) {
    console.error('Error al eliminar KPI:', error)
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

@media (max-width: 768px) {
  .process-list {
    padding: 0.5rem;
  }
}
</style>