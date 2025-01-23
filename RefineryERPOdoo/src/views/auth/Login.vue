<template>
  <div class="login-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h2 class="text-center mb-4">Iniciar Sesión</h2>
              
              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="email" class="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="email"
                    required
                    autocomplete="email"
                  >
                </div>

                <div class="mb-4">
                  <label for="password" class="form-label">Contraseña</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="password"
                    required
                    autocomplete="current-password"
                  >
                </div>

                <div v-if="error" class="alert alert-danger" role="alert">
                  {{ error }}
                </div>

                <button 
                  type="submit" 
                  class="btn btn-primary w-100"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  Ingresar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const { error: loginError } = await authStore.login(email.value, password.value)
    
    if (loginError) {
      error.value = 'Credenciales inválidas. Por favor, intente de nuevo.'
      return
    }
    
    router.push('/')
  } catch (e) {
    error.value = 'Ocurrió un error al iniciar sesión. Por favor, intente más tarde.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  padding: 2rem 0;
}

.card {
  border: none;
  border-radius: 10px;
}

.btn-primary {
  height: 46px;
  font-size: 1rem;
}
</style>