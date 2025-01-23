<template>
  <div class="quality-dashboard">
    <div class="row">
      <div class="col-12 mb-4">
        <h1 class="h3">Quality Management Dashboard</h1>
      </div>
    </div>

    <div class="row">
      <!-- Quick Stats -->
      <div class="col-md-3 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Documents</h5>
            <p class="h2">{{ documents.length }}</p>
          </div>
        </div>
      </div>

      <div class="col-md-3 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Processes</h5>
            <p class="h2">{{ processes.length }}</p>
          </div>
        </div>
      </div>

      <div class="col-md-3 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Active KPIs</h5>
            <p class="h2">{{ indicators.length }}</p>
          </div>
        </div>
      </div>

      <div class="col-md-3 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Open Issues</h5>
            <p class="h2">{{ openIssues }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Recent Documents -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Recent Documents</h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <ul v-else class="list-group list-group-flush">
              <li v-for="doc in recentDocuments" :key="doc.id" class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-0">{{ doc.title }}</h6>
                    <small class="text-muted">Version {{ doc.version }}</small>
                  </div>
                  <span class="badge bg-primary">{{ doc.status }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Process KPIs -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Process KPIs</h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else>
              <canvas ref="kpiChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useQualityStore } from '@/stores/quality'
import { Chart } from 'chart.js/auto'

const qualityStore = useQualityStore()
const kpiChart = ref<HTMLCanvasElement | null>(null)

const documents = computed(() => qualityStore.documents)
const processes = computed(() => qualityStore.processes)
const indicators = computed(() => qualityStore.indicators)
const loading = computed(() => qualityStore.loading)

const recentDocuments = computed(() => {
  return documents.value
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5)
})

const openIssues = ref(0)

onMounted(async () => {
  await Promise.all([
    qualityStore.fetchDocuments(),
    qualityStore.fetchProcesses(),
    qualityStore.fetchProcessIndicators()
  ])

  if (kpiChart.value) {
    new Chart(kpiChart.value, {
      type: 'bar',
      data: {
        labels: indicators.value.map(i => i.name),
        datasets: [{
          label: 'Current Value',
          data: indicators.value.map(i => i.target_value),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }
})
</script>

<style scoped>
.quality-dashboard {
  padding: 1rem;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-title {
  color: #495057;
}

.spinner-border {
  width: 1.5rem;
  height: 1.5rem;
}
</style>