<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">ERP Refinery</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/quality/documents">Documents</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/quality/processes">Processes</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/quality/audits">Audits</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/quality/non-conformities">Non-Conformities</router-link>
          </li>
        </ul>
        <div class="d-flex">
          <button class="btn btn-outline-light" @click="logout">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>