import { createRouter, createWebHistory } from 'vue-router'
import demo from './modules/demo'

export const routes = [...demo]

const router = createRouter({
	// hash模式
	history: createWebHistory(),
	routes,
	// 刷新时，滚动条位置还原
	scrollBehavior: () => ({ left: 0, top: 0 }),
})
export default router
