<template>
  <div class="app-container">
    <nav-bar v-if="isAuthenticated" />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from './stores/auth'
import NavBar from './components/layout/NavBar.vue'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<style lang="scss">
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }
}
</style>