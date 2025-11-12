// useUserStore
// Contains all user-related functions which CAN be used directly in .vue files
// Handling challenge information as a reactive object (state) from which info can be pulled
// Functions are exposed to .vue files with minimal input parameters required

import { ref, computed } from 'vue'

import { defineStore } from 'pinia'
import router from '@/router'
import { supa, dbSignIn, dbSignOut, dbSignUp } from '@/services/auth'
import { dbDefaultProfile, dbDeletePersona, dbGetPersonas, dbUploadPersona } from '@/services/dbPersona'

export const useUserStore = defineStore('userStore', () => {
  const user = ref(null)
  const session = ref(null)

  // loaded from db
  const profiles = ref({})
  // gotten from selection page
  const chosenProfile = ref({})

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

  async function checkDefaultProfile() {
    await dbDefaultProfile(supa, user.value.id)
  }

  async function getPersonas() {
    const data = await dbGetPersonas(supa, user.value.id)
    profiles.value = data
    console.log('checking userStore profiles: ', profiles.value)
  }

  async function addProfile(profile) {
    const data = await dbUploadPersona(supa, user.value.id, profile.name, profile.age, profile.readingLevel, profile.interests, profile.learningStyle);
    profiles.value.push(profile)
    console.log('added profile: ', profile)
    return data;
  }

  async function editProfile(profile) {
    const index = profiles.value.findIndex((p) => p.name === profile.name)
    if (index > -1) {
      profiles.value[index] = { ...profiles.value[index], ...profile }
      console.log('Edited profile:', profiles.value[index])
    } else {
      // If not found, treat it as a new profile
      // FIXME: later if we care about this
      await addProfile(profile)
    }
    console.log(profiles)
  }

  async function deleteProfile(profile) {
    const index = profiles.value.indexOf(profile)
    console.log("deleting: ", profiles.value[index].id)
    await dbDeletePersona(supa, user.value.id, profiles.value[index].id)
    if (index > -1) {
      profiles.value.splice(index, 1)
    }
  }

  return {
    user,
    session,
    isLoggedIn,
    profiles,
    chosenProfile,
    loadUser,
    signUp,
    signIn,
    signOut,
    checkDefaultProfile,
    getPersonas,
    addProfile,
    editProfile,
    deleteProfile,
  }
})
