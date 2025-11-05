// useCourseStore
// Contains all course-related functions which CAN be used directly in .vue files
// Handling course information as a reactive object (state) from which info can be pulled
// Functions are exposed to .vue files with minimal input parameters required

import { ref, reactive } from 'vue'

import { defineStore } from 'pinia'
import router from '@/router'

export const useCourseStore = defineStore("courseStore", () => {
  const user = ref(null);
  const course = reactive({
    id: null
  });

  return { user, course }
})
