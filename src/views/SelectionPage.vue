<script setup>
import { ref } from "vue";
import NavBar from "@/components/NavBar.vue";
import BaseButton from "@/components/BaseButton.vue";
import router from "@/router";

import { useCourseStore } from "@/stores/course";

// const userStore = useUserStore();
const courseStore = useCourseStore()
const isLoading = ref(false)
const selectedSchedule = ref(null);
const selectedTopic = ref(null);
const topics = ["Learn basic Python", "Understand the U.S Civil War", "Improve essay writing"];
const schedule = ["1 week", "2 weeks", "3 weeks"];

const selectSchedule = (schedule) => {
  selectedSchedule.value = schedule;
};


const selectTopic = (topic) => {
  selectedTopic.value = topic;
};

const handleSubmit = async () => {
  if (!selectSchedule.value || !selectedTopic.value) {
    alert("Please select both a language and a topic");
    return null;
  }

  console.log("Selected:", {
    schedule: schedule.value,
    topic: selectedTopic.value,
  });
  isLoading.value = true;
  // processing here
  isLoading.value = false;

  // router.push("/challenge");
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-950">
    <NavBar />

    <main class="flex-1 flex items-center justify-center px-6 py-12">
      <div class="max-w-4xl w-full space-y-12">

        <!-- topic section -->
        <div class="space-y-6">
          <h2 class="text-3xl font-bold text-white text-center">
            Choose Topic
          </h2>
          <div class="flex justify-center">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
              <button v-for="topic in topics" :key="topic" @click="selectTopic(topic)" :class="[
                'px-6 py-4 rounded-lg font-medium transition-all',
                'border-2',
                selectedTopic === topic
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600',
              ]">
                {{ topic }}
              </button>
            </div>
          </div>
        </div>

        <!-- schedule sectiion-->
        <div class="space-y-6">
          <h2 class="text-3xl font-bold text-white text-center">
            Choose Language
          </h2>
          <div class="flex justify-center">
            <div class="grid grid-cols-3 gap-5 max-w-2xl">
              <button v-for="s in schedule" :key="s" @click="selectSchedule(s)" :class="[
                'px-6 py-4 rounded-lg font-medium transition-all',
                'border-2',
                selectedSchedule === s
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600',
              ]">
                {{ s }}
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-center pt-6">
          <BaseButton :loading="isLoading" @click="handleSubmit" :disabled="!selectedSchedule || !selectedTopic"
            class="min-w-[200px]">
            Submit
          </BaseButton>
        </div>
      </div>
    </main>
  </div>
</template>
