<script setup>
import { onMounted, ref } from "vue";
import router from "@/router";
import NavBar from "@/components/NavBar.vue";
import BaseButton from "@/components/BaseButton.vue";
import CourseCard from "@/components/CourseCard.vue";

import { useUserStore } from "@/stores/user";
import { useCourseStore } from "@/stores/course";
import { syncStoreUsers } from "@/services/auth";

const userStore = useUserStore();
const courseStore = useCourseStore();

const courses = ref([]);
const isLoading = ref(false);

onMounted(async () => {
  // reset course and course_id
  userStore.chosenProfile = null;
  courseStore.course = null;
  courseStore.course_id = null;

  await userStore.getPersonas();
  if (userStore.profiles.length < 1) {
    await userStore.createDefaultProfileIfNoneExist();
    await userStore.getPersonas();
  }
  syncStoreUsers(userStore, courseStore);
  await fetchSavedCourses();
});

const fetchSavedCourses = async () => {
  isLoading.value = true;
  const data = await courseStore.getCourses();
  courses.value = data || [];
  isLoading.value = false;
};

const handleCourseClick = async (course) => {
  courseStore.loadCourseData(course);
  await userStore.loadPersonaData(courseStore.persona_id);
  router.push("/course");
};

const handleDeleteCourse = async (courseId) => {
  await courseStore.deleteCourse(courseId);
  courses.value = courses.value.filter(c => c.id !== courseId);
};

const handleCreateNew = () => {
  router.push("/selection");
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-950">
    <NavBar />

    <main class="flex-1 flex flex-col px-6 py-12">
      <div class="max-w-6xl w-full mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-12">
          <h1 class="text-4xl font-bold text-white">
            My Courses
          </h1>
          <BaseButton @click="handleCreateNew" variant="primary">
            Create New Course
          </BaseButton>
        </div>

        <!-- Loading state -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <svg class="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
        </div>

        <!-- Empty state -->
        <div v-else-if="courses.length === 0" class="flex flex-col items-center justify-center py-16 space-y-6">
          <div class="text-center space-y-3">
            <p class="text-gray-400 text-lg">
              No courses yet. Create a new course by clicking below
            </p>
          </div>
          <BaseButton @click="handleCreateNew" variant="secondary">
            Create Your First Course
          </BaseButton>
        </div>

        <!-- Courses grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard v-for="course in courses" :key="course.id" :course="course"
            @click="() => handleCourseClick(course)" @delete="() => handleDeleteCourse(course.id)" />
        </div>
      </div>
    </main>
  </div>
</template>
