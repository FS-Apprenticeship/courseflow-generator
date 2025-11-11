<script setup>
import { onMounted, ref } from "vue";
import router from "@/router";

import NavBar from "@/components/NavBar.vue";
import BaseButton from "@/components/BaseButton.vue";
import PersonaCard from "@/components/PersonaCard.vue";

import { useUserStore } from "@/stores/user";
import { useCourseStore } from "@/stores/course";
import { syncStoreUsers } from "@/services/auth";

const userStore = useUserStore();
const courseStore = useCourseStore();

onMounted(async () => {
  syncStoreUsers(userStore, courseStore);
});

const topics = ["Learn basic Python", "Understand the U.S Civil War", "Improve essay writing"];
const schedule = ["1 week", "2 weeks", "3 weeks"];
const isLoading = ref(false);

const selectedProfile = ref(null);
const selectedSchedule = ref(null);
const selectedTopic = ref(null);

const selectSchedule = (schedule) => {
  console.log("selected sched: ", schedule);
  selectedSchedule.value = schedule;
};

const selectTopic = (topic) => {
  console.log("selected topic: ", topic);
  selectedTopic.value = topic;
};

const selectProfile = (profile) => {
  console.log("selected profile: ", profile);
  selectedProfile.value = profile;
  userStore.chosenProfile.value = profile;
};

const handleSubmit = async () => {
  if (!selectedProfile.value || !selectedSchedule.value || !selectedTopic.value) {
    alert("Please select profile, topic, and duration");
    return null;
  }

  console.log("Selected:", {
    profile: selectedProfile.value,
    schedule: selectedSchedule.value,
    topic: selectedTopic.value,
  });
  isLoading.value = true;
  // processing here
  await courseStore.aiCreateOverview(selectedTopic.value, selectedSchedule.value, selectedProfile.value);
  isLoading.value = false;

  courseStore.selectionCompleted.value = true;

  router.push("/overview");
};

const handleProfileSave = (profile) => {
  // FIXME: if name is changed, it creates a new profile
  userStore.editProfile(profile);
  console.log("Profile saved:", profile);
};

const handleProfileDiscard = () => {
  console.log("Profile discarded");
};

const handleProfileDelete = (profile) => {
  userStore.deleteProfile(profile);
  // Clear selection if the deleted profile was selected
  if (selectedProfile.value === profile) {
    selectedProfile.value = null;
  }
}


const addNewProfile = () => {
  // Opens the card component with an empty profile to create a new one
  userStore.addProfile({});
  console.log(userStore.profiles);
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-950">
    <NavBar />

    <main class="flex-1 flex flex-col px-6 py-12">
      <div class="max-w-6xl w-full mx-auto space-y-12">

        <!-- Profiles section at the top -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-3xl font-bold text-white">
              Learner Profiles
            </h2>
            <BaseButton @click="addNewProfile" class="px-4 py-2">
              + Add Profile
            </BaseButton>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <PersonaCard v-for="(profile, index) in userStore.profiles" :key="index" :profile="profile"
              :isSelected="selectedProfile === profile" @select="selectProfile(profile)" @save="handleProfileSave"
              @discard="handleProfileDiscard" @delete="handleProfileDelete(profile)" />
          </div>
        </div>

        <!-- Divider -->
        <hr class="border-gray-700" />

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
            Choose Duration of Course
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
