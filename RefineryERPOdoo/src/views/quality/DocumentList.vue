<template>
  <div class="document-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Quality Documents</h2>
      <button class="btn btn-primary" @click="showCreateModal = true">
        <i class="fas fa-plus"></i> New Document
      </button>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Type</th>
                <th>Version</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="doc in documents" :key="doc.id">
                <td>{{ doc.code }}</td>
                <td>{{ doc.title }}</td>
                <td>{{ doc.type }}</td>
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
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div class="modal fade" :class="{ show: showCreateModal }" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingDocument ? 'Edit' : 'Create' }} Document</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveDocument">
              <div class="mb-3">
                <label class="form-label">Document Type</label>
                <select v-model="documentForm.type_id" class="form-select" required>
                  <option v-for="type in documentTypes" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Title</label>
                <input v-model="documentForm.title" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Content</label>
                <textarea v-model="documentForm.content" class="form-control" rows="10" required></textarea>
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
import { ref, onMounted } from 'vue'
import { useQualityStore } from '@/stores/quality'

const qualityStore = useQualityStore()
const showCreateModal = ref(false)
const editingDocument = ref(null)
const documentForm = ref({
  type_id: '',
  title: '',
  content: ''
})

const documentTypes = ref([])
const documents = ref([])

const getStatusBadgeClass = (status: string) => {
  const classes = {
    draft: 'badge bg-secondary',
    published: 'badge bg-success',
    archived: 'badge bg-danger'
  }
  return classes[status] || 'badge bg-secondary'
}

const viewDocument = (doc) => {
  // Implement document viewer
}

const editDocument = (doc) => {
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
    console.error('Error saving document:', error)
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