// useCourseStore
// Contains all course-related functions which CAN be used directly in .vue files
// Handling course information as a reactive object (state) from which info can be pulled
// Functions are exposed to .vue files with minimal input parameters required

import { ref, reactive } from 'vue'
import router from '@/router'

import { defineStore } from 'pinia'
import { createOverview, createCourse } from '@/services/openai';

export const useCourseStore = defineStore("courseStore", () => {
  const user = ref(null);
  const course = ref(null);
  const overview = reactive({
    overview: null,
    num_lessons: null,
    total_hours: null
  });

  async function aiCreateOverview(goal, duration, profile) {
    let data = await createOverview(goal, duration, profile.age, profile.reading_level, profile.interests, profile.learning_style);
    data = JSON.parse(data.text)
    this.overview.overview = data.overview
    this.overview.num_lessons = data.num_lessons
    this.overview.total_hours = data.total_hours
  }

  async function aiCreateCourse(age, reading_level, interests, learning_style) {
    let data = await createCourse(this.overview.overview, this.overview.total_hours, this.overview.num_lessons, age, reading_level, interests, learning_style);
    data = JSON.parse(data.text)
    this.course = data
  }

  return { user, course, overview, aiCreateOverview, aiCreateCourse }
})
