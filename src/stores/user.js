// useUserStore
// Contains all user-related functions which CAN be used directly in .vue files
// Handling challenge information as a reactive object (state) from which info can be pulled
// Functions are exposed to .vue files with minimal input parameters required

import { ref, computed, reactive } from 'vue'

import { defineStore } from 'pinia'
import router from '@/router'
import { supa, dbSignIn, dbSignOut, dbSignUp } from '@/services/auth'

export const useUserStore = defineStore('userStore', () => {
  const user = ref(null)
  const session = ref(null)

  const isLoggedIn = computed(() => user.value != null)

  async function loadUser() {
    const { data } = await supa.auth.getUser()
    this.user = data.user || null
    if (this.user !== null) {
      console.log('user already logged in')
    } else {
      console.log('user not logged in')
    }
  }

  async function signUp(email, password) {
    const { data, error } = await dbSignUp(supa, email, password)
    return { data, error }
  }

  async function signIn(email, password) {
    const { data, error } = await dbSignIn(supa, email, password)
    if (error) throw error
    this.user = data.user
    this.profile.id = data.user.id
    this.session = data.session
    router.push('/selection')
  }

  async function signOut() {
    const { error } = await dbSignOut(supa)
    this.user = null
    this.session = null
    if (error) throw error
    router.push('/')
  }

  return { user, session, isLoggedIn, loadUser, signUp, signIn, signOut }
})
