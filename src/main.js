import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import App from './App.vue'
import router from './router'

export const pinia = createPinia();
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Toast, {})

app.mount('#app')
