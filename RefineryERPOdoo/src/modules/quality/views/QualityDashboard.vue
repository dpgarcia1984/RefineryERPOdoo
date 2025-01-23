<template>
  <quality-layout>
    <div class="quality-dashboard">
      <div class="row">
        <div class="col-12 mb-4">
          <h1 class="h3">Panel de Control de Calidad</h1>
        </div>
      </div>

      <div class="row">
        <div class="col-md-3 mb-4">
          <quality-metric
            title="Documentos"
            :value="documents.length"
            bg-color="bg-primary"
          />
        </div>

        <div class="col-md-3 mb-4">
          <quality-metric
            title="Procesos"
            :value="processes.length"
            bg-color="bg-success"
          />
        </div>

        <div class="col-md-3 mb-4">
          <quality-metric
            title="KPIs Activos"
            :value="indicators.length"
            bg-color="bg-info"
          />
        </div>

        <div class="col-md-3 mb-4">
          <quality-metric
            title="Problemas Abiertos"
            :value="openIssues"
            bg-color="bg-warning"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-4">
          <quality-card
            title="Documentos Recientes"
            description="Últimos documentos actualizados"
          >
            <div v-if="loading" class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
            </div>
            <ul v-else class="list-group list-group-flush">
              <li v-for="doc in recentDocuments" :key="doc.id" class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-0">{{ doc.title }}</h6>
                    <small class="text-muted">Versión {{ doc.version }}</small>
                  </div>
                  <span class="badge bg-primary">{{ doc.status }}</span>
                </div>
              </li>
            </ul>
          </quality-card>
        </div>

        <div class="col-md-6 mb-4">
          <quality-card
            title="KPIs de Procesos"
            description="Indicadores clave de rendimiento"
          >
            <div v-if="loading" class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
            </div>
            <div v-else>
              <canvas ref="kpiChart"></canvas>
            </div>
          </quality-card>
        </div>
      </div>
    </div>
  </quality-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Chart } from 'chart.js/auto'
import { useQualityStore } from '../store'
import QualityLayout from '../layouts/QualityLayout.vue'
import QualityCard from '../components/QualityCard.vue'
import QualityMetric from '../components/QualityMetric.vue'

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
          label: 'Valor Actual',
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
</style>