<script setup>
defineProps({
  currentLessonIndex: {
    type: Number,
    required: true,
  },
  totalLessons: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <div class="p-4 bg-gray-800 rounded-lg border border-gray-700">
    <p class="text-xs font-medium text-gray-400 uppercase mb-2">Progress</p>
    <div class="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
      <div :style="{ width: (currentLessonIndex + 1) / totalLessons * 100 + '%' }"
        class="bg-blue-600 h-full transition-all duration-300"></div>
    </div>
    <p class="text-sm text-gray-300 mt-2">
      {{ currentLessonIndex + 1 }} of {{ totalLessons }}
    </p>
  </div>
</template>
