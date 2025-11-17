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

const isLoading = ref(false);

const topic = ref("");

const durationUnit = ref("weeks"); // "days" or "weeks"
const durationVal = ref(null);

const selectedProfile = ref(null);

onMounted(async () => {
  // reset course and course_id
  // userStore.chosenProfile = null;
  // courseStore.course = null;
  // courseStore.course_id = null;

  await userStore.checkDefaultProfile();
  await userStore.getPersonas();
  syncStoreUsers(userStore, courseStore);
});

const selectProfile = (profile) => {
  console.log("selected profile: ", profile);
  selectedProfile.value = profile;
  userStore.chosenProfile.value = profile;
};

const handleSubmit = async () => {
  if (!selectedProfile.value || !durationVal.value || !topic.value) {
    alert("Please fill in profile, topic, and duration");
    return null;
  }

  // format to add unit at the end of string before we send it to ai
  const schedule = `${durationVal.value} ${durationUnit.value}`;

  console.log("Selected:", {
    profile: selectedProfile.value,
    schedule: schedule,
    topic: topic.value,
  });
  isLoading.value = true;
  // processing here
  await courseStore.aiCreateOverview(topic.value, schedule, selectedProfile.value);
  courseStore.selectionCompleted = true;

  isLoading.value = false;

  router.push("/overview");
};

const handleProfileSave = async (profile) => {
  // index indicates which one we are changing
  console.log("selection - checking edited profile: ", profile)
  // FIXME: if name is changed, it creates a new profile
  await userStore.editProfile(profile);
  console.log("Profile saved:", profile);
};

const handleProfileDiscard = () => {
  console.log("Profile discarded");
};

const handleProfileDelete = async (profile) => {
  await userStore.deleteProfile(profile);
  // Clear selection if the deleted profile was selected
  if (selectedProfile.value === profile) {
    selectedProfile.value = null;
  }
}

const addNewProfile = async () => {
  // Opens the card component with an empty profile to create a new one
  await userStore.addProfile({});
  console.log(userStore.profiles);
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-950">
    <NavBar />

    <main class="flex-1 flex flex-col px-6 py-12">
      <div class="max-w-6xl w-full mx-auto space-y-12">

        <!-- Profiles section -->
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

        <!-- topic section  -->
        <div class="space-y-6">
          <h2 class="text-3xl font-bold text-white text-center">
            What do you want to learn?
          </h2>
          <div class="flex justify-center">
            <input v-model="topic" type="text" placeholder="Enter topic (e.g., Python, History, Writing)"
              class="w-full max-w-md px-6 py-4 rounded-lg bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 transition-colors" />
          </div>
        </div>

        <!-- duration section -->
        <div class="space-y-6">
          <h2 class="text-3xl font-bold text-white text-center">
            Choose Duration of Course
          </h2>

          <!-- Duration unit toggle -->
          <div class="flex justify-center gap-4">
            <button @click="durationUnit = 'days'" :class="[
              'px-8 py-3 rounded-lg font-medium transition-all border-2 text-lg',
              durationUnit === 'days'
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600',
            ]">
              Days
            </button>
            <button @click="durationUnit = 'weeks'" :class="[
              'px-8 py-3 rounded-lg font-medium transition-all border-2 text-lg',
              durationUnit === 'weeks'
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600',
            ]">
              Weeks
            </button>
          </div>

          <!-- Duration value buttons -->
          <div class="flex justify-center pt-8">
            <div class="flex flex-wrap gap-3 justify-center max-w-lg">
              <button v-for="day in 7" v-show="durationUnit === 'days'" :key="`day-${day}`" @click="durationVal = day"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-all border-2',
                  durationVal === day
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600',
                ]">
                {{ day }} day{{ day !== 1 ? 's' : '' }}
              </button>

              <button v-for="week in 4" v-show="durationUnit === 'weeks'" :key="`week-${week}`"
                @click="durationVal = week" :class="[
                  'px-4 py-2 rounded-lg font-medium transition-all border-2',
                  durationVal === week
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600',
                ]">
                {{ week }} week{{ week !== 1 ? 's' : '' }}
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-center pt-6">
          <BaseButton :loading="isLoading" @click="handleSubmit" :disabled="!selectedProfile || !durationVal || !topic"
            class="min-w-[200px]">
            Submit
          </BaseButton>
        </div>
      </div>
    </main>
  </div>
</template>
