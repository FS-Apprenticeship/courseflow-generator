// useCourseStore
// Contains all course-related functions which CAN be used directly in .vue files
// Handling course information as a reactive object (state) from which info can be pulled
// Functions are exposed to .vue files with minimal input parameters required

import { ref, reactive } from 'vue'

import { defineStore } from 'pinia'
import { supa } from '@/services/auth'
import { createOverview, createCourse, refineCourse } from '@/services/openai'
import { dbGetCourses, dbUploadCourses, dbUpdateCourse, dbDeleteCourse } from '@/services/dbCourses'

export const useCourseStore = defineStore('courseStore', () => {
  const user = ref(null)
  const course = ref({})
  const overview = reactive({
    overview: null,
    num_lessons: null,
    total_hours: null,
  })

  const course_id = ref(null);

  // for router guards
  const selectionCompleted = ref(false)
  const overviewCompleted = ref(false)

  async function aiCreateOverview(goal, duration, profile) {
    let data = await createOverview(
      goal,
      duration,
      profile.age,
      profile.reading_level,
      profile.interests,
      profile.learning_style,
    )
    data = JSON.parse(data.text)
    this.overview.overview = data.overview
    this.overview.num_lessons = data.num_lessons
    this.overview.total_hours = data.total_hours
  }

  async function aiCreateCourse(profile) {
    let data = await createCourse(
      overview.overview,
      overview.total_hours,
      overview.num_lessons,
      profile.age,
      profile.reading_level,
      profile.interests,
      profile.learning_style,
    )
    data = JSON.parse(data.text)
    course.value = data
  }

  async function aiRefineCourse(refinementType, profile) {
    try {
      let data = await refineCourse(course.value, refinementType, profile)
      data = JSON.parse(data.text)
      course.value = data
    } catch (error) {
      console.log('Error refining course:', error)
      throw error
    }
  }

  async function uploadCourse() {
    if (course.value == {}) {
      console.log("course not found - cant upload")
      return;
    }

    const data = await dbUploadCourses(supa, user.value.id, course.value);
    course_id.value = data.id;
    return data;
  }

  async function getCourses() {
    const data = await dbGetCourses(supa, user.value.id);
    return data;
  }

  async function updateCourse() {
    const data = await dbUpdateCourse(supa, course_id.value, course.value);
    return data;
  }

  async function deleteCourse(id) {
    await dbDeleteCourse(supa, id)
  }

  return {
    user,
    course,
    overview,
    selectionCompleted,
    overviewCompleted,
    aiCreateOverview,
    aiCreateCourse,
    aiRefineCourse,
    uploadCourse,
    getCourses,
    updateCourse,
    deleteCourse,
  }
})
