// useCourseStore
// Contains all course-related functions which CAN be used directly in .vue files
// Handling course information as a reactive object (state) from which info can be pulled
// Functions are exposed to .vue files with minimal input parameters required

import { ref, reactive } from 'vue'

import { defineStore } from 'pinia'
import { createOverview, createCourse, refineCourse } from '@/services/openai';

export const useCourseStore = defineStore("courseStore", () => {
  const user = ref(null);
  const course = ref({});
  const overview = reactive({
    overview: null,
    num_lessons: null,
    total_hours: null
  });

  // for router guards
  const selectionCompleted = ref(false);
  const overviewCompleted = ref(false);

  async function aiCreateOverview(goal, duration, profile) {
    let data = await createOverview(goal, duration, profile.age, profile.reading_level, profile.interests, profile.learning_style);
    data = JSON.parse(data.text)
    this.overview.overview = data.overview
    this.overview.num_lessons = data.num_lessons
    this.overview.total_hours = data.total_hours
  }

  async function aiCreateCourse(profile) {
    let data = await createCourse(overview.overview, overview.total_hours, overview.num_lessons, profile.age, profile.reading_level, profile.interests, profile.learning_style);
    data = JSON.parse(data.text)
    course.value = data
  }

  async function aiRefineCourse(refinementType, profile) {
    try {
      let data = await refineCourse(course.value, refinementType, profile)
      data = JSON.parse(data.text)
      course.value = data
    } catch (error) {
      console.log("[v0] Error refining course:", error)
      throw error
    }
  }

  return { user, course, overview, selectionCompleted, overviewCompleted, aiCreateOverview, aiCreateCourse, aiRefineCourse }
})
