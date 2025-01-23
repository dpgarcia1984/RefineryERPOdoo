import { defineStore } from 'pinia'
import { supabase } from '../lib/supabaseClient'

interface User {
  id: string
  email: string
  role: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false
  }),
  
  actions: {
    async login(email: string, password: string) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) throw error
        
        this.user = data.user
        this.isAuthenticated = true
        return { data, error: null }
      } catch (error) {
        return { data: null, error }
      }
    },
    
    async logout() {
      await supabase.auth.signOut()
      this.user = null
      this.isAuthenticated = false
    }
  }
})