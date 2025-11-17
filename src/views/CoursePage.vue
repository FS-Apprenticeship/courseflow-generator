<script setup>
import { ref, computed, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { useCourseStore } from "@/stores/course";
import NavBar from "@/components/NavBar.vue";
import BaseButton from "@/components/BaseButton.vue";

const userStore = useUserStore();
const courseStore = useCourseStore();

const currentLessonIndex = ref(0);
const expandedLessonIndex = ref(null);
const expandedSectionIndex = ref({});
const isRefining = ref(false);

const course = ref({
  goal: "",
  duration: "",
  total_hours: 0,
  lessons: [],
});

const currentLesson = computed(() => course.value.lessons[currentLessonIndex.value]);

const sectionOrder = ["introduction", "context", "example", "activity", "assessment", "reflection"];

const handleSaveCourse = async () => {
  await courseStore.uploadCourse(userStore.chosenProfile.value.id);
}

const toggleSectionExpanded = (sectionKey) => {
  if (expandedSectionIndex.value[sectionKey]) {
    expandedSectionIndex.value[sectionKey] = false;
  } else {
    expandedSectionIndex.value[sectionKey] = true;
  }
};

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

watch(
  () => courseStore.course,
  (newCourse) => {
    if (newCourse) {
      course.value = newCourse;
    }
  },
  { immediate: true }
);
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

          <BaseButton @click="handleSaveCourse" variant="primary">
            Save Course
          </BaseButton>
        </div>

        <!-- Main Layout: Current Lesson (Left) + Lesson Stack (Right) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Current Lesson Detail View (Left - 2 columns on large screens) -->
          <div class="lg:col-span-2">
            <div class="bg-gray-800 rounded-lg border border-gray-700 p-8">
              <div class="mb-6">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h2 class="text-3xl font-bold text-white mb-2">
                      {{ currentLesson.title }}
                    </h2>
                    <p class="text-gray-400">Lesson {{ currentLessonIndex + 1 }} of {{ course.lessons.length }}</p>
                  </div>
                  <div class="text-right">
                    <div class="bg-blue-600 rounded-lg px-4 py-2 inline-block">
                      <span class="text-white font-medium">Currently Viewing</span>
                    </div>
                  </div>
                </div>

                <!-- Lesson Metadata -->
                <div class="flex gap-6 mb-8 pb-6 border-b border-gray-700">
                  <div>
                    <span class="text-sm font-medium text-gray-400">Duration</span>
                    <p class="text-xl font-bold text-white mt-1">{{ currentLesson.duration }}</p>
                  </div>
                </div>
              </div>

              <!-- Scaffold Sections - All Expandable -->
              <div class="space-y-3">
                <h3 class="text-sm font-bold text-gray-300 uppercase tracking-wide mb-4">Lesson Structure</h3>

                <div v-for="sectionKey in sectionOrder" :key="sectionKey"
                  class="border border-gray-700 rounded-lg overflow-hidden">
                  <!-- Section Header - Clickable -->
                  <button @click="toggleSectionExpanded(sectionKey)"
                    class="w-full px-6 py-4 bg-gray-700 hover:bg-gray-600 transition-colors flex items-center justify-between">
                    <div class="flex items-center gap-3 text-left">
                      <span class="text-lg font-semibold text-white capitalize">{{ sectionKey }}</span>
                      <span class="text-sm font-medium text-gray-300">
                        ({{ currentLesson[sectionKey]?.assessment_format || "—" }})
                      </span>
                    </div>
                    <svg :class="[
                      'w-5 h-5 text-gray-300 transition-transform',
                      expandedSectionIndex[sectionKey] ? 'rotate-180' : '',
                    ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>

                  <!-- Section Content - Expandable -->
                  <div v-if="expandedSectionIndex[sectionKey] && currentLesson[sectionKey]"
                    class="bg-gray-800 px-6 py-4 space-y-4 border-t border-gray-700">
                    <!-- Rationale -->
                    <div>
                      <h4 class="text-sm font-bold text-gray-300 uppercase mb-2">Rationale</h4>
                      <p class="text-gray-200 leading-relaxed">{{ currentLesson[sectionKey].rationale }}</p>
                    </div>

                    <!-- Assessment Format -->
                    <div class="pt-4 border-t border-gray-700">
                      <h4 class="text-sm font-bold text-gray-300 uppercase mb-2">Assessment Format</h4>
                      <div class="inline-block bg-blue-900 text-blue-200 px-3 py-1 rounded text-sm font-medium">
                        {{ currentLesson[sectionKey].assessment_format }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="flex gap-4 mt-8 pt-6 border-t border-gray-700">
                <BaseButton variant="secondary" @click="goToPreviousLesson" :disabled="currentLessonIndex === 0">
                  Previous Lesson
                </BaseButton>
                <BaseButton @click="goToNextLesson" :disabled="currentLessonIndex === course.lessons.length - 1">
                  Next Lesson
                </BaseButton>
              </div>
            </div>
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
              <div class="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <p class="text-xs font-medium text-gray-400 uppercase mb-2">Progress</p>
                <div class="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div :style="{ width: ((currentLessonIndex + 1) / course.lessons.length) * 100 + '%' }"
                    class="bg-blue-600 h-full transition-all duration-300"></div>
                </div>
                <p class="text-sm text-gray-300 mt-2">
                  {{ currentLessonIndex + 1 }} of {{ course.lessons.length }}
                </p>
              </div>

              <!-- Added refinement panel at the bottom -->
              <div class="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <p class="text-xs font-medium text-gray-400 uppercase mb-4">Review & Refine</p>
                <div class="space-y-2">
                  <BaseButton variant="secondary" :disabled="isRefining" @click="refineCourseSimplifiy"
                    class="w-full text-sm">
                    <span v-if="isRefining" class="inline-flex items-center gap-2">
                      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                      </svg>
                      Simplifying...
                    </span>
                    <span v-else>Simplify Scope</span>
                  </BaseButton>
                  <BaseButton variant="secondary" :disabled="isRefining" @click="refineCourseAddDepth"
                    class="w-full text-sm">
                    <span v-if="isRefining" class="inline-flex items-center gap-2">
                      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                      </svg>
                      Adding depth...
                    </span>
                    <span v-else>Add More Depth</span>
                  </BaseButton>
                  <BaseButton variant="secondary" :disabled="isRefining" @click="refineCourseAdjustWorkloadLess"
                    class="w-full text-sm">
                    <span v-if="isRefining" class="inline-flex items-center gap-2">
                      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                      </svg>
                      Adjusting...
                    </span>
                    <span v-else>Adjust Workload - Less</span>
                  </BaseButton>
                  <BaseButton variant="secondary" :disabled="isRefining" @click="refineCourseAdjustWorkloadMore"
                    class="w-full text-sm">
                    <span v-if="isRefining" class="inline-flex items-center gap-2">
                      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                      </svg>
                      Adjusting...
                    </span>
                    <span v-else>Adjust Workload - More</span>
                  </BaseButton>
                  <BaseButton variant="secondary" :disabled="isRefining" @click="refineCourseAlignGoal"
                    class="w-full text-sm">
                    <span v-if="isRefining" class="inline-flex items-center gap-2">
                      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                      </svg>
                      Aligning...
                    </span>
                    <span v-else>Align Better to Goal</span>
                  </BaseButton>
                </div>
              </div>

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
