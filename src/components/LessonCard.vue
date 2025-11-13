<script setup>
import { ref } from 'vue';
import BaseButton from './BaseButton.vue';

const props = defineProps({
  lesson: {
    type: Object,
    required: true,
  },
  lessonIndex: {
    type: Number,
    required: true,
  },
  totalLessons: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['previous-lesson', 'next-lesson']);

const expandedSectionIndex = ref({});

const sectionOrder = ['introduction', 'context', 'example', 'activity', 'assessment', 'reflection'];

const toggleSectionExpanded = (sectionKey) => {
  if (expandedSectionIndex.value[sectionKey]) {
    expandedSectionIndex.value[sectionKey] = false;
  } else {
    expandedSectionIndex.value[sectionKey] = true;
  }
};

const handlePrevious = () => {
  emit('previous-lesson');
};

const handleNext = () => {
  emit('next-lesson');
};
</script>

<template>
  <div class="bg-gray-800 rounded-lg border border-gray-700 p-8">
    <div class="mb-6">
      <div class="flex items-start justify-between mb-4">
        <div>
          <h2 class="text-3xl font-bold text-white mb-2">
            {{ lesson.title }}
          </h2>
          <p class="text-gray-400">Lesson {{ lessonIndex + 1 }} of {{ totalLessons }}</p>
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
          <p class="text-xl font-bold text-white mt-1">{{ lesson.duration }}</p>
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
              ({{ lesson[sectionKey]?.assessment_format || "—" }})
            </span>
          </div>
          <svg :class="[
            'w-5 h-5 text-gray-300 transition-transform',
            expandedSectionIndex[sectionKey] ? 'rotate-180' : '',
          ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>

        <!-- Section Content - Expandable -->
        <div v-if="expandedSectionIndex[sectionKey] && lesson[sectionKey]"
          class="bg-gray-800 px-6 py-4 space-y-4 border-t border-gray-700">
          <!-- Rationale -->
          <div>
            <h4 class="text-sm font-bold text-gray-300 uppercase mb-2">Rationale</h4>
            <p class="text-gray-200 leading-relaxed">{{ lesson[sectionKey].rationale }}</p>
          </div>

          <!-- Assessment Format -->
          <div class="pt-4 border-t border-gray-700">
            <h4 class="text-sm font-bold text-gray-300 uppercase mb-2">Assessment Format</h4>
            <div class="inline-block bg-blue-900 text-blue-200 px-3 py-1 rounded text-sm font-medium">
              {{ lesson[sectionKey].assessment_format }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex gap-4 mt-8 pt-6 border-t border-gray-700">
      <BaseButton variant="secondary" @click="handlePrevious" :disabled="lessonIndex === 0">
        Previous Lesson
      </BaseButton>
      <BaseButton @click="handleNext" :disabled="lessonIndex === totalLessons - 1">
        Next Lesson
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
button {
  transition: all 0.2s ease-in-out;
}
</style>
