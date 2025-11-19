<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/user";
import { useCourseStore } from "@/stores/course";
import { useToast } from "vue-toastification";

import NavBar from "@/components/NavBar.vue";
import BaseButton from "@/components/BaseButton.vue";
import LessonCard from "@/components/LessonCard.vue";
import CourseProgressIndicator from "@/components/CourseProgressIndicator.vue";
import RefinementPanel from "@/components/RefinementPanel.vue";

const userStore = useUserStore();
const courseStore = useCourseStore();
const toast = useToast();

const currentLessonIndex = ref(0);
const expandedLessonIndex = ref(null);
const isRefining = ref(false);
const isSaveLoading = ref(false);

const course = computed(() => courseStore.course || {
  goal: "",
  duration: "",
  total_hours: 0,
  lessons: [],
});

const currentLesson = computed(() => course.value.lessons[currentLessonIndex.value]);

const handleSaveCourse = async () => {
  isSaveLoading.value = true;
  await courseStore.uploadCourse(userStore.chosenProfile.id);
  isSaveLoading.value = false;
  toast.success("Course saved successfully!");
}

const goToLesson = (index) => {
  currentLessonIndex.value = index;
  expandedLessonIndex.value = index;
};

const goToNextLesson = () => {
  if (currentLessonIndex.value < course.value.lessons.length - 1) {
    currentLessonIndex.value += 1;
    expandedLessonIndex.value = currentLessonIndex.value;
  }
};

const goToPreviousLesson = () => {
  if (currentLessonIndex.value > 0) {
    currentLessonIndex.value -= 1;
    expandedLessonIndex.value = currentLessonIndex.value;
  }
};

const refineCourseSimplifiy = async () => {
  isRefining.value = true;
  try {
    await courseStore.aiRefineCourse("simplify_scope", userStore.chosenProfile);
    currentLessonIndex.value = 0;
    expandedLessonIndex.value = 0;
    await courseStore.updateCourse();
  } catch (error) {
    console.log("Error simplifying course scope:", error);
  } finally {
    isRefining.value = false;
  }
};

const refineCourseAddDepth = async () => {
  isRefining.value = true;
  try {
    await courseStore.aiRefineCourse("add_depth", userStore.chosenProfile);
    currentLessonIndex.value = 0;
    expandedLessonIndex.value = 0;
    await courseStore.updateCourse();
  } catch (error) {
    console.log("Error adding depth to course:", error);
  } finally {
    isRefining.value = false;
  }
};

const refineCourseAdjustWorkloadLess = async () => {
  isRefining.value = true;
  try {
    await courseStore.aiRefineCourse("less_workload", userStore.chosenProfile);
    currentLessonIndex.value = 0;
    expandedLessonIndex.value = 0;
    await courseStore.updateCourse();
  } catch (error) {
    console.log("Error adjusting workload:", error);
  } finally {
    isRefining.value = false;
  }
};

const refineCourseAdjustWorkloadMore = async () => {
  isRefining.value = true;
  try {
    await courseStore.aiRefineCourse("more_workload", userStore.chosenProfile);
    currentLessonIndex.value = 0;
    expandedLessonIndex.value = 0;
    await courseStore.updateCourse();
  } catch (error) {
    console.log("Error adjusting workload:", error);
  } finally {
    isRefining.value = false;
  }
};

const refineCourseAlignGoal = async () => {
  isRefining.value = true;
  try {
    await courseStore.aiRefineCourse("align_goal", userStore.chosenProfile);
    currentLessonIndex.value = 0;
    expandedLessonIndex.value = 0;
    await courseStore.updateCourse();
  } catch (error) {
    console.log("Error aligning course to goal:", error);
  } finally {
    isRefining.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-950">
    <NavBar />

    <main class="flex-1 px-6 py-12">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="mb-12">
          <h1 class="text-4xl font-bold text-white mb-2">{{ course.course_name }}</h1>
          <p class="text-gray-400 mb-6">Duration: {{ course.duration }} | Total: {{ course.total_hours }} hours</p>

          <!-- Course Stats -->
          <div class="flex gap-8 mb-6">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-400">Total Duration:</span>
              <span class="text-lg font-bold text-blue-400">{{ course.total_hours }} hours</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-400">Lessons:</span>
              <span class="text-lg font-bold text-blue-400">{{ course.lessons.length }}</span>
            </div>
          </div>

          <BaseButton @loading="isSaveLoading.value" @click="handleSaveCourse" variant="primary">
            Save Course
          </BaseButton>
        </div>

        <!-- Main Layout: Current Lesson (Left) + Lesson Stack (Right) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Current Lesson Detail View (Left - 2 columns on large screens) -->
          <div class="lg:col-span-2">
            <LessonCard :lesson="currentLesson" :lessonIndex="currentLessonIndex" :totalLessons="course.lessons.length"
              @previous-lesson="goToPreviousLesson" @next-lesson="goToNextLesson" />
          </div>

          <!-- Lesson Stack Navigation (Right - 1 column on large screens) -->
          <div class="lg:col-span-1">
            <div class="sticky top-6">
              <h3 class="text-lg font-bold text-white mb-4">Course Flow</h3>
              <div class="space-y-3">
                <button v-for="(lesson, index) in course.lessons" :key="index" @click="goToLesson(index)" :class="[
                  'w-full text-left p-4 rounded-lg border-2 transition-all',
                  currentLessonIndex === index
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-750',
                ]">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h4 :class="[
                        'font-semibold mb-1',
                        currentLessonIndex === index ? 'text-white' : 'text-gray-100',
                      ]">
                        {{ lesson.title }}
                      </h4>
                      <p :class="[
                        'text-sm',
                        currentLessonIndex === index ? 'text-blue-100' : 'text-gray-400',
                      ]">
                        {{ lesson.duration }}
                      </p>
                    </div>
                    <div v-if="currentLessonIndex === index" class="ml-2 text-blue-200">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>

              <!-- Progress Indicator -->
              <div class="mt-6">
                <CourseProgressIndicator :currentLessonIndex="currentLessonIndex"
                  :totalLessons="course.lessons.length" />
              </div>

              <!-- Added refinement panel at the bottom -->
              <RefinementPanel :isRefining="isRefining" @simplify-scope="refineCourseSimplifiy"
                @add-depth="refineCourseAddDepth" @adjust-workload-less="refineCourseAdjustWorkloadLess"
                @adjust-workload-more="refineCourseAdjustWorkloadMore" @align-goal="refineCourseAlignGoal" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
button {
  transition: all 0.2s ease-in-out;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
