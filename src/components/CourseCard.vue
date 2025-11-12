<script setup>
defineProps({
  course: {
    type: Object,
    required: true,
  },
});

defineEmits(['click', 'delete']);
</script>

<template>
  <div
    class="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-blue-500 transition-colors cursor-pointer group"
    @click="$emit('click', course)">

    <!-- Course card content -->
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
        {{ course.course_data.course_name || 'Untitled Course' }}
      </h2>

      <div class="space-y-2 text-sm text-gray-300">
        <div class="flex items-center justify-between">
          <span class="text-gray-400">Duration:</span>
          <span class="text-white font-medium">{{ course.course_data.duration }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-400">Lessons:</span>
          <span class="text-white font-medium">{{ course.course_data.lessons?.length || 0 }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-400">Total Hours:</span>
          <span class="text-white font-medium">{{ course.course_data.total_hours }}</span>
        </div>
      </div>

      <!-- Delete button -->
      <div class="pt-4 border-t border-gray-700">
        <button @click.stop="$emit('delete', course.id)"
          class="w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-950 rounded transition-colors">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
