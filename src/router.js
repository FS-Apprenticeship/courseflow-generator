import { createRouter, createWebHistory } from 'vue-router'

import { pinia } from './main'
import { useUserStore } from './stores/user.js'
import { useCourseStore } from './stores/course'

import LandingPage from '@/views/LandingPage.vue'
import SigninPage from '@/views/SigninPage.vue'
import SignupPage from '@/views/SignupPage.vue'
import SelectionPage from '@/views/SelectionPage.vue'
import OverviewPage from './views/OverviewPage.vue'
import CoursePage from './views/CoursePage.vue'

// choose persona, topic, learning style
// see course generation
// click specific lines which can be refined or changed (not sure if manually or openai)

const routes = [
  { path: '/', component: LandingPage },
  { path: '/signin', component: SigninPage },
  { path: '/signup', component: SignupPage },
  { path: '/selection', component: SelectionPage },
  { path: '/overview', component: OverviewPage },
  { path: '/course', component: CoursePage },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// initialize the user stores in router so theyre already loaded
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore(pinia)
  const courseStore = useCourseStore(pinia)
  await userStore.loadUser()
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/signin')
  } else {
    next()
  }
})

export default router
