<script setup>
import { ref } from 'vue'

import { useUserStore } from '@/stores/user'
import { useCourseStore } from '@/stores/course'
import { syncStoreUsers } from '@/services/auth'

const userStore = useUserStore()
const courseStore = useCourseStore()

const email = ref('')
const password = ref('')

async function signInHelper() {
  await userStore.signIn(email.value, password.value)
  syncStoreUsers(userStore, courseStore);
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-950">
    <div class="bg-gray-900 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-800">
      <h2 class="text-3xl font-bold mb-8 text-center text-white">Sign In</h2>
      <form @submit.prevent="signInHelper()" class="flex flex-col space-y-5">
        <input type="email" placeholder="Email" v-model="email"
          class="bg-gray-800 text-white border border-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400" />
        <input type="password" placeholder="Password" v-model="password"
          class="bg-gray-800 text-white border border-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400" />
        <button type="submit"
          class="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
          Sign In
        </button>
      </form>
      <p class="mt-6 text-center text-gray-400 text-sm">
        Don't have an account?
        <router-link to="/signup" class="text-blue-500 hover:text-blue-400 font-medium">
          Sign Up
        </router-link>
      </p>
    </div>
  </div>
</template>
