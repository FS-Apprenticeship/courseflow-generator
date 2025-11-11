<script setup>
import { ref, computed } from 'vue'
import BaseButton from '@/components/BaseButton.vue'

/**
 * use like -
 * <PersonaCard
 *   :profile="profileData"
 *   :isSelected="true"
 *   @select="handleSelect"
 *   @edit="handleEdit"
 *   @save="handleSave"
 *   @discard="handleDiscard"
 *   @delete="handleDelete"
 * />
 *
 * - profile: Object with structure {
 *     name: string,
 *     age: number,
 *     readingLevel: string,
 *     interests: array of strings,
 *     learningStyle: string
 *   }
 *   Can be empty object {} to create a new profile.
 * - isSelected: boolean indicating if this profile is currently selected
 *
 * events to remember:
 * - @select: Emitted when user clicks the card to select it.
 * - @edit: Emitted when user clicks the edit button.
 * - @save: Emitted when user clicks Save. Returns edited profile object.
 * - @discard: Emitted when user closes the modal.
 * - @delete: Emitted when user clicks the delete button.
 */

const props = defineProps({
  profile: {
    type: Object,
    default: () => ({})
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select', 'edit', 'save', 'discard', 'delete'])

// Form state
const editForm = ref({
  name: props.profile.name || '',
  age: props.profile.age || '',
  readingLevel: props.profile.readingLevel || 'A',
  interests: props.profile.interests ? [...props.profile.interests] : [''],
  learningStyle: props.profile.learningStyle || 'A'
})

const isModalOpen = ref(false)
const isNewProfile = computed(() => !props.profile.name)

const readingLevelOptions = ["Elementary School", "Middle School", "High School", "Undergraduate", "Graduate", "PhD"]
const learningStyleOptions = ["Visual", "Conceptual", "Hands On"]

const openModal = () => {
  editForm.value = {
    name: props.profile.name || '',
    age: props.profile.age || '',
    readingLevel: props.profile.readingLevel || 'A',
    interests: props.profile.interests ? [...props.profile.interests] : [''],
    learningStyle: props.profile.learningStyle || 'A'
  }

  isModalOpen.value = true
  emit('edit')
}

const closeModal = () => {
  isModalOpen.value = false
  emit('discard')
}

const addInterest = () => {
  if (editForm.value.interests.length < 5) {
    editForm.value.interests.push('')
  }
}

const removeInterest = (index) => {
  editForm.value.interests.splice(index, 1)
}

const handleSave = () => {
  // Filter out empty interests
  const cleanedInterests = editForm.value.interests.filter(i => i.trim() !== '')

  const savedProfile = {
    name: editForm.value.name,
    age: editForm.value.age,
    readingLevel: editForm.value.readingLevel,
    interests: cleanedInterests,
    learningStyle: editForm.value.learningStyle
  }

  emit('save', savedProfile)
  closeModal()
}

const handleDiscard = () => {
  closeModal()
}

const handleDelete = () => {
  emit('delete')
}

// Modal backdrop click handler
const handleBackdropClick = (e) => {
  if (e.target === e.currentTarget) {
    closeModal()
  }
}
</script>

<template>
  <!-- Card Display -->
  <div v-if="!isModalOpen" class="cursor-pointer">
    <!-- Made card selectable with blue highlight, added edit button -->
    <div @click="emit('select')" :class="[
      'border-2 rounded-lg p-6 hover:border-blue-600 transition-all hover:shadow-lg relative h-full',
      isSelected
        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/50'
        : 'bg-gray-800 border-gray-700 text-white'
    ]">
      <h3 class="text-xl font-bold">{{ profile.name || 'New Profile' }}</h3>
      <p :class="[
        'text-sm mt-1',
        isSelected ? 'text-blue-100' : 'text-gray-400'
      ]">{{ profile.learningStyle || 'Not set' }}</p>

      <!-- Edit button in bottom right -->
      <div class="absolute bottom-3 right-3 flex gap-2">
        <button @click.stop="openModal"
          class="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs font-medium transition-colors">
          Edit
        </button>
        <button @click.stop="handleDelete"
          class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors">
          Delete
        </button>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="handleBackdropClick">
    <div class="bg-gray-800 border-2 border-gray-700 rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] flex flex-col">
      <!-- Header -->
      <h2 class="text-2xl font-bold text-white">
        {{ isNewProfile ? 'Create Profile' : 'Edit Profile' }}
      </h2>

      <!-- Form -->
      <div class="flex-1 overflow-y-auto my-6 space-y-4 pr-2">
        <div class="space-y-4">
          <!-- Profile Name -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Profile Name</label>
            <input v-model="editForm.name" type="text"
              class="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-600"
              placeholder="Enter profile name" />
          </div>

          <!-- Age -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Age</label>
            <input v-model="editForm.age" type="number"
              class="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-600"
              placeholder="Enter age" />
          </div>

          <!-- Reading Level -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Reading Level</label>
            <select v-model="editForm.readingLevel"
              class="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-600">
              <option v-for="option in readingLevelOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>

          <!-- Learning Style -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Learning Style</label>
            <select v-model="editForm.learningStyle"
              class="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-600">
              <option v-for="option in learningStyleOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>

          <!-- Interests -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Interests (up to 5)</label>
            <div class="space-y-2">
              <div v-for="(interest, index) in editForm.interests" :key="index" class="flex gap-2">
                <input v-model="editForm.interests[index]" type="text"
                  class="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-600"
                  placeholder="Enter interest" />
                <button v-if="editForm.interests.length > 1" @click="removeInterest(index)"
                  class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors">
                  Remove
                </button>
              </div>
              <button v-if="editForm.interests.length < 5" @click="addInterest"
                class="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600 rounded font-medium transition-colors">
                + Add Interest
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="flex gap-3 pt-4 border-t border-gray-700 mt-6">
        <BaseButton @click="handleSave" class="flex-1">
          Save
        </BaseButton>
        <BaseButton @click="handleDiscard" variant="secondary" class="flex-1">
          Discard
        </BaseButton>
      </div>
    </div>
  </div>
</template>
