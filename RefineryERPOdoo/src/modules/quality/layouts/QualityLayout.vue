<template>
  <div class="quality-layout">
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar para desktop -->
        <div v-if="isDesktop" class="col-md-3 col-lg-2 sidebar">
          <nav class="nav flex-column">
            <router-link 
              v-for="item in menuItems" 
              :key="item.path"
              :to="item.path"
              class="nav-link"
              active-class="active"
            >
              <i :class="item.icon"></i>
              {{ item.name }}
            </router-link>
          </nav>
        </div>

        <!-- Contenido principal -->
        <div :class="contentClasses">
          <!-- Navbar móvil -->
          <nav v-if="isMobile" class="navbar navbar-expand-lg navbar-light bg-light mb-3">
            <div class="container-fluid">
              <button 
                class="navbar-toggler" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#mobileNav"
              >
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="mobileNav">
                <ul class="navbar-nav">
                  <li v-for="item in menuItems" :key="item.path" class="nav-item">
                    <router-link :to="item.path" class="nav-link">
                      <i :class="item.icon"></i>
                      {{ item.name }}
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useResponsive } from '../composables/useResponsive'

const { isMobile, isDesktop } = useResponsive()

const menuItems = [
  { name: 'Dashboard', path: '/quality', icon: 'fas fa-tachometer-alt' },
  { name: 'Documents', path: '/quality/documents', icon: 'fas fa-file-alt' },
  { name: 'Processes', path: '/quality/processes', icon: 'fas fa-project-diagram' },
  { name: 'Audits', path: '/quality/audits', icon: 'fas fa-clipboard-check' },
  { name: 'Non-Conformities', path: '/quality/non-conformities', icon: 'fas fa-exclamation-triangle' }
]

const contentClasses = computed(() => ({
  'col-md-9 col-lg-10': isDesktop.value,
  'col-12': !isDesktop.value
}))
</script>

<style scoped>
.quality-layout {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.sidebar {
  background-color: white;
  padding: 1rem;
  min-height: 100vh;
  border-right: 1px solid #dee2e6;
}

.nav-link {
  color: #495057;
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  margin-bottom: 0.25rem;
}

.nav-link:hover {
  background-color: #e9ecef;
}

.nav-link.active {
  background-color: #0d6efd;
  color: white;
}

.nav-link i {
  margin-right: 0.5rem;
  width: 1.25rem;
  text-align: center;
}
</style>