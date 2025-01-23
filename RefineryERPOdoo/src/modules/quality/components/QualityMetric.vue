<template>
  <div class="quality-metric" :class="{ 'is-mobile': isMobile }">
    <div class="card" :class="bgColor">
      <div class="card-body">
        <h6 class="card-title text-white">{{ title }}</h6>
        <h2 class="text-white mb-0">{{ value }}</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResponsive } from '../composables/useResponsive'

defineProps<{
  title: string
  value: number | string
  bgColor: string
}>()

const { isMobile } = useResponsive()
</script>

<style scoped>
.quality-metric {
  margin-bottom: 1rem;
}

.quality-metric.is-mobile {
  padding: 0.5rem;
}

.card {
  border: none;
  border-radius: 10px;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

.card-title {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .card-title {
    font-size: 0.75rem;
  }
  
  h2 {
    font-size: 1.25rem;
  }
}
</style>