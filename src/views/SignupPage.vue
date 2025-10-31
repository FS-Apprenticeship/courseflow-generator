<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')

async function signUpHelper() {
  errorMessage.value = ''
  successMessage.value = ''
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  if (!emailPattern.test(email.value)) {
    errorMessage.value = 'Please enter a valid email address.'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters long.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  const { error } = await userStore.signUp(email.value, password.value)
  if (error) {
    errorMessage.value = error.message
  } else {
    successMessage.value = 'Check your email for a confirmation link.'
    setTimeout(() => router.push('/signin'), 2000)
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-950">
    <div class="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-800">
      <h2 class="text-3xl font-bold mb-8 text-center text-white">Sign Up</h2>

      <form @submit.prevent="signUpHelper()" class="space-y-5">
        <div>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 mt-2"
        >
          Sign Up
        </button>
      </form>

      <p v-if="errorMessage" class="mt-5 text-red-400 text-sm text-center">
        {{ errorMessage }}
      </p>
      <p v-if="successMessage" class="mt-5 text-green-400 text-sm text-center">
        {{ successMessage }}
      </p>

      <p class="mt-8 text-center text-gray-400 text-sm">
        Already have an account?
        <router-link
          to="/signin"
          class="text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          Sign In
        </router-link>
      </p>
    </div>
  </div>
</template>
