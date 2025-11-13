<script setup>
import BaseButton from "@/components/BaseButton.vue";

defineProps({
  isRefining: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits([
  "simplify-scope",
  "add-depth",
  "adjust-workload-less",
  "adjust-workload-more",
  "align-goal",
]);

const handleRefinement = (action) => {
  emit(action);
};
</script>

<template>
  <div class="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
    <p class="text-xs font-medium text-gray-400 uppercase mb-4">Review & Refine</p>
    <div class="space-y-2">
      <BaseButton variant="secondary" :disabled="isRefining" @click="handleRefinement('simplify-scope')"
        class="w-full text-sm">
        <span v-if="isRefining" class="inline-flex items-center gap-2">
          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          Simplifying...
        </span>
        <span v-else>Simplify Scope</span>
      </BaseButton>
      <BaseButton variant="secondary" :disabled="isRefining" @click="handleRefinement('add-depth')"
        class="w-full text-sm">
        <span v-if="isRefining" class="inline-flex items-center gap-2">
          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          Adding depth...
        </span>
        <span v-else>Add More Depth</span>
      </BaseButton>
      <BaseButton variant="secondary" :disabled="isRefining" @click="handleRefinement('adjust-workload-less')"
        class="w-full text-sm">
        <span v-if="isRefining" class="inline-flex items-center gap-2">
          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          Adjusting...
        </span>
        <span v-else>Adjust Workload - Less</span>
      </BaseButton>
      <BaseButton variant="secondary" :disabled="isRefining" @click="handleRefinement('adjust-workload-more')"
        class="w-full text-sm">
        <span v-if="isRefining" class="inline-flex items-center gap-2">
          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          Adjusting...
        </span>
        <span v-else>Adjust Workload - More</span>
      </BaseButton>
      <BaseButton variant="secondary" :disabled="isRefining" @click="handleRefinement('align-goal')"
        class="w-full text-sm">
        <span v-if="isRefining" class="inline-flex items-center gap-2">
          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
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
</template>
