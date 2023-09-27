import { createApp } from 'vue'
import router from './router'
import './styles/index.scss'

import directives from '@/directives'
import echarts from '@/utils/echarts'
import dayjs from 'dayjs'
import App from './App.vue'

const app = createApp(App)

// 注册自定义指令
directives(app)
// // 挂载dayjs
app.config.globalProperties.$dayjs = dayjs
// // 挂载echarts
app.config.globalProperties.$echarts = echarts

app.use(router).mount('#app')
