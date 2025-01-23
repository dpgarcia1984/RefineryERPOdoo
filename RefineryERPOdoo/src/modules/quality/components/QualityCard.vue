<template>
  <div class="quality-card" :class="{ 'is-mobile': isMobile }">
    <div class="card h-100">
      <div class="card-body">
        <h5 class="card-title">{{ title }}</h5>
        <p class="card-text">{{ description }}</p>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResponsive } from '../composables/useResponsive'

defineProps<{
  title: string
  description: string
}>()

const { isMobile } = useResponsive()
</script>

<style scoped>
.quality-card {
  margin-bottom: 1rem;
}

.quality-card .card {
  transition: transform 0.2s;
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.quality-card .card:hover {
  transform: translateY(-2px);
}

.quality-card.is-mobile .card {
  margin: 0.5rem;
}

.card-title {
  color: #2c3e50;
  font-weight: 600;
}
</style>