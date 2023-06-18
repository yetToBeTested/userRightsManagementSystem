import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'normalize.css'
import '@/assets/css/index.less'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { useLoginStore } from './stores/login/login'
import { localCache } from './utils/cache'
import { LOGIN_TOKEN, USER_INFO } from './global/constants'

import vTrack from '@/global/vTrack'

// import './assets/main.css'

const app = createApp(App)
app.use(createPinia())

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

const loginStore = useLoginStore()
loginStore.loadLocalCacheAction()
const userName = localCache.getCache(USER_INFO)
app.use(router)
app.use(
  vTrack,
  {
    baseParams: {
      uid: userName.username,
      userAgent: 'Chrome'
    },
    prefix: 'app'
  },
  // ['/main/user', '/main/system/account', '/main/system/task']
  [],
  ['/main/user']
)
app.mount('#app')
