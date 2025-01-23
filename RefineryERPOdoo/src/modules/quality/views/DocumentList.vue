<template>
  <quality-layout>
    <div class="document-list">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Documentos de Calidad</h2>
        <button class="btn btn-primary" @click="showCreateModal = true">
          <i class="fas fa-plus"></i> Nuevo Documento
        </button>
      </div>

      <quality-card
        title="Lista de Documentos"
        description="Gestión de documentación del sistema de calidad"
      >
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Código</th>
                <th>Título</th>
                <th>Tipo</th>
                <th>Versión</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="doc in documents" :key="doc.id">
                <td>{{ doc.code }}</td>
                <td>{{ doc.title }}</td>
                <td>{{ doc.type?.name }}</td>
                <td>{{ doc.version }}</td>
                <td>
                  <span :class="getStatusBadgeClass(doc.status)">
                    {{ doc.status }}
                  </span>
                </td>
                <td>
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" @click="viewDocument(doc)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" @click="editDocument(doc)">
                      <i class="fas fa-edit"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </quality-card>

      <!-- Modal de Creación/Edición -->
      <div class="modal fade" :class="{ show: showCreateModal }" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ editingDocument ? 'Editar' : 'Crear' }} Documento</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveDocument">
                <div class="mb-3">
                  <label class="form-label">Tipo de Documento</label>
                  <select v-model="documentForm.type_id" class="form-select" required>
                    <option v-for="type in documentTypes" :key="type.id" :value="type.id">
                      {{ type.name }}
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Título</label>
                  <input v-model="documentForm.title" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Contenido</label>
                  <textarea v-model="documentForm.content" class="form-control" rows="10" required></textarea>
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
import { ref, onMounted } from 'vue'
import { useQualityStore } from '../store'
import QualityLayout from '../layouts/QualityLayout.vue'
import QualityCard from '../components/QualityCard.vue'
import type { Document } from '../types'

const qualityStore = useQualityStore()
const showCreateModal = ref(false)
const editingDocument = ref<Document | null>(null)
const documentForm = ref({
  type_id: '',
  title: '',
  content: ''
})

const documentTypes = ref([])
const documents = ref<Document[]>([])

const getStatusBadgeClass = (status: string) => {
  const classes = {
    draft: 'badge bg-secondary',
    published: 'badge bg-success',
    archived: 'badge bg-danger'
  }
  return classes[status] || 'badge bg-secondary'
}

const viewDocument = (doc: Document) => {
  // Implementar visor de documentos
}

const editDocument = (doc: Document) => {
  editingDocument.value = doc
  documentForm.value = { ...doc }
  showCreateModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  editingDocument.value = null
  documentForm.value = {
    type_id: '',
    title: '',
    content: ''
  }
}

const saveDocument = async () => {
  try {
    if (editingDocument.value) {
      await qualityStore.updateDocument(editingDocument.value.id, documentForm.value)
    } else {
      await qualityStore.createDocument(documentForm.value)
    }
    closeModal()
    await loadDocuments()
  } catch (error) {
    console.error('Error al guardar documento:', error)
  }
}

const loadDocuments = async () => {
  await qualityStore.fetchDocuments()
  documents.value = qualityStore.documents
}

onMounted(async () => {
  await loadDocuments()
})
</script>

<style scoped>
.modal.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}

.document-list {
  padding: 1rem;
}
</style>