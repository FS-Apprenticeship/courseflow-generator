<script setup>
import NavBar from '@/components/NavBar.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useUserStore } from '@/stores/user'
import router from '@/router'

const userStore = useUserStore()
const isLoggedIn = userStore.isLoggedIn

function goToSelection() {
  router.push('/selection')
}

function goToSavedCourses() {
  router.push('/saved-courses')
}

function signInHandler() {
  router.push('/signin')
}

function signUpHandler() {
  router.push('/signup')
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-950">
    <NavBar />

    <main class="flex-1 flex flex-col items-center justify-center px-6">
      <div class="max-w-3xl w-full text-center space-y-8">
        <div class="space-y-4">
          <h1 class="text-5xl md:text-6xl font-bold text-white tracking-tight">Course Flow Generator</h1>
          <p class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Generate customized courses based on your learning patterns
          </p>
        </div>

        <div v-if="!isLoggedIn" class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <BaseButton variant="secondary" @click="signInHandler()">Sign In</BaseButton>
          <BaseButton variant="secondary" @click="signUpHandler()">Sign Up</BaseButton>
        </div>
        <div v-if="isLoggedIn" class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <BaseButton variant="secondary" @click="goToSelection()">Create New Course</BaseButton>
          <BaseButton variant="secondary" @click="goToSavedCourses()">Your Courses</BaseButton>
        </div>
      </div>
    </main>
  </div>
</template>
