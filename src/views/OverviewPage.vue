<script setup>
import { ref, nextTick, computed, onMounted } from "vue";
import NavBar from "@/components/NavBar.vue";
import BaseButton from "@/components/BaseButton.vue";

import { useCourseStore } from "@/stores/course";

const courseStore = useCourseStore();

const isEditingOverview = ref(false);
const isEditingHours = ref(false);
const isEditingLessons = ref(false);

const hoursInputRef = ref(null);
const lessonsInputRef = ref(null);
const overviewTextareaRef = ref(null);

// Sample data - user will populate this with actual data
const totalHours = ref(null);
const numLessons = ref(null);
const overviewText = ref("");

const overview = computed(() => {
  return courseStore.overview;
})

onMounted(async () => {
  // TODO see how it explains python basics to a 1st grader --
  await courseStore.aiCreateOverview("understanding python", "2 weeks", "13", "elementary school", ["gaming", "books", "laptops"], "conceptual");
  totalHours.value = overview.value.total_hours
  numLessons.value = overview.value.num_lessons;
  overviewText.value = overview.value.overview;

  // temp
  await courseStore.aiCreateCourse("2 weeks", "13", "elementary school", ["gaming", "books", "laptops"], "conceptual");
})

const editedOverview = ref(overviewText.value);
const editedHours = ref(totalHours.value);
const editedLessons = ref(numLessons.value);

const toggleEditOverview = () => {
  if (isEditingOverview.value) {
    overviewText.value = editedOverview.value;
  } else {
    editedOverview.value = overviewText.value;
  }
  isEditingOverview.value = !isEditingOverview.value;
  if (isEditingOverview.value) {
    nextTick(() => {
      overviewTextareaRef.value?.focus();
      // overviewTextareaRef.value?.select();
    });
  }
};

const toggleEditHours = () => {
  if (isEditingHours.value) {
    totalHours.value = editedHours.value;
  } else {
    editedHours.value = totalHours.value;
  }
  isEditingHours.value = !isEditingHours.value;
  if (isEditingHours.value) {
    nextTick(() => {
      hoursInputRef.value?.focus();
      // hoursInputRef.value?.select();
    });
  }
};

const toggleEditLessons = () => {
  if (isEditingLessons.value) {
    numLessons.value = editedLessons.value;
  } else {
    editedLessons.value = numLessons.value;
  }
  isEditingLessons.value = !isEditingLessons.value;
  if (isEditingLessons.value) {
    nextTick(() => {
      lessonsInputRef.value?.focus();
      // lessonsInputRef.value?.select();
    });
  }
};

const cancelEdit = () => {
  isEditingOverview.value = false;
  isEditingHours.value = false;
  isEditingLessons.value = false;
  editedOverview.value = overviewText.value;
  editedHours.value = totalHours.value;
  editedLessons.value = numLessons.value;
};

</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-950">
    <NavBar />

    <main class="flex-1 flex items-center justify-center px-6 py-12">
      <div class="max-w-4xl w-full space-y-8">
        <!-- Header -->
        <div class="text-center space-y-2">
          <h1 class="text-4xl font-bold text-white">Course Overview</h1>
          <p class="text-gray-400">Click any box to edit the course details</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 gap-6 md:gap-8">
          <!-- Total Hours Box -->
          <div @click="toggleEditHours" :class="[
            'p-6 rounded-lg border-2 transition-all cursor-pointer',
            isEditingHours
              ? 'bg-blue-600 border-blue-600'
              : 'bg-gray-800 border-gray-700 hover:border-blue-500 hover:bg-gray-750',
          ]">
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-300">Total Hours</p>
              <div v-if="isEditingHours" class="flex items-center gap-2">
                <input ref="hoursInputRef" v-model.number="editedHours" type="number"
                  class="w-full px-3 py-2 bg-gray-900 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-400"
                  min="1" @click.stop @keydown.enter="toggleEditHours" @keydown.escape="cancelEdit" />
              </div>
              <p v-else class="text-3xl font-bold text-white">{{ totalHours }}</p>
            </div>
          </div>

          <!-- Number of Lessons Box -->
          <div @click="toggleEditLessons" :class="[
            'p-6 rounded-lg border-2 transition-all cursor-pointer',
            isEditingLessons
              ? 'bg-blue-600 border-blue-600'
              : 'bg-gray-800 border-gray-700 hover:border-blue-500 hover:bg-gray-750',
          ]">
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-300">Number of Lessons</p>
              <div v-if="isEditingLessons" class="flex items-center gap-2">
                <input ref="lessonsInputRef" v-model.number="editedLessons" type="number"
                  class="w-full px-3 py-2 bg-gray-900 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-400"
                  min="1" @click.stop @keydown.enter="toggleEditLessons" @keydown.escape="cancelEdit" />
              </div>
              <p v-else class="text-3xl font-bold text-white">{{ numLessons }}</p>
            </div>
          </div>
        </div>

        <!-- Overview Text Box -->
        <div @click="toggleEditOverview" :class="[
          'p-6 rounded-lg border-2 transition-all cursor-pointer',
          isEditingOverview
            ? 'bg-blue-600 border-blue-600'
            : 'bg-gray-800 border-gray-700 hover:border-blue-500 hover:bg-gray-750',
        ]">
          <div class="space-y-3">
            <p class="text-sm font-medium text-gray-300">Overview</p>
            <div v-if="isEditingOverview">
              <textarea ref="overviewTextareaRef" v-model="editedOverview"
                class="w-full px-4 py-3 bg-gray-900 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-400 resize-none"
                rows="5" @click.stop @keydown.escape="cancelEdit"></textarea>
            </div>
            <p v-else class="text-base text-gray-100 leading-relaxed">
              {{ overviewText }}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="isEditingOverview || isEditingHours || isEditingLessons" class="flex gap-4 justify-center pt-4">
          <BaseButton @click="cancelEdit" variant="secondary">Cancel</BaseButton>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Subtle animation for hover state */
.transition-all {
  transition: all 0.2s ease-in-out;
}
</style>
