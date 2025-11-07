// useUserStore
// Contains all user-related functions which CAN be used directly in .vue files
// Handling challenge information as a reactive object (state) from which info can be pulled
// Functions are exposed to .vue files with minimal input parameters required

import { ref, computed } from 'vue'

import { defineStore } from 'pinia'
import router from '@/router'
import { supa, dbSignIn, dbSignOut, dbSignUp } from '@/services/auth'

export const useUserStore = defineStore('userStore', () => {
  const user = ref(null)
  const session = ref(null)
  // set sane defaults later on
  const profiles = ref([
    { name: 'Profile 1', age: 15, readingLevel: 'A', interests: ['reading'], learningStyle: 'A' },
    { name: 'Profile 2', age: 12, readingLevel: 'B', interests: ['sports', 'music'], learningStyle: 'B' },
  ]);

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

  function addProfile(profile) {
    profiles.value.push(profile);
    console.log("added profile: ", profile)
  }

  function editProfile(profile) {
    const index = profiles.value.findIndex(p => p.name === profile.name)
    if (index > -1) {
      // Merge to keep reactivity (Vue tracks the existing object)
      profiles.value[index] = { ...profiles.value[index], ...profile }
      console.log('Edited profile:', profiles.value[index])
    } else {
      // If not found, treat it as a new profile
      addProfile(profile)
    }
    console.log(profiles)
  }

  function deleteProfile(profile) {
    const index = profiles.value.indexOf(profile);
    if (index > -1) {
      profiles.value.splice(index, 1);
    }
  }

  return { user, session, isLoggedIn, profiles, loadUser, signUp, signIn, signOut, addProfile, editProfile, deleteProfile }
})
