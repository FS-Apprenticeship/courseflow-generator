<script setup>
import { useUserStore } from '@/stores/user'
import router from '@/router'
import { useRoute } from 'vue-router'

const userStore = useUserStore()

// function for WHEN to display the sign out button
const showSignOut = userStore.isLoggedIn

// check when to show back to selection button
const pathsForBack = ["/course", "/overview", "/saved-courses"]
const route = useRoute()
const showBackButton = pathsForBack.includes(route.path)

// helper function to actually sign the person out
async function signOutHelper() {
  await userStore.signOut()
  router.push('/').then(() => {
    window.location.reload()
  })
}

function goBackToSelection() {
  router.push('/selection')
}
</script>

<template>
  <nav class="bg-gray-900 border-b border-gray-800 text-white px-6 py-4 flex justify-between items-center">
    <div class="font-bold text-xl">Course Flow Generator - Flatiron School</div>
    <div class="flex gap-4 items-center">
      <button v-if="showBackButton" @click="goBackToSelection()"
        class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 border border-gray-700 transition-colors font-medium">
        Back to Selection
      </button>
      <button v-if="showSignOut" @click="signOutHelper()"
        class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 border border-gray-700 transition-colors font-medium">
        Sign Out
      </button>
    </div>
  </nav>
</template>
