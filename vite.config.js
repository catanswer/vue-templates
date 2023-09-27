import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

// 自动引入vue相关的
import AutoImport from 'unplugin-auto-import/vite'
// 自动引入.vue文件组件
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// icon图标
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

export default defineConfig({
	// 在生产中服务时的基本公共路径。
	// base: './',
	plugins: [
		vue(),
		AutoImport({
			// 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
			imports: ['vue', 'vue-router'],
			include: [
				/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
				/\.vue$/,
				/\.vue\?vue/, // .vue
				/\.md$/, // .md
			],
			// 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
			resolvers: [
				// 自动导入图标组件
				IconsResolver(),
				ElementPlusResolver(),
			],
		}),
		Components({
			resolvers: [
				// 自动注册图标组件
				IconsResolver({
					prefix: 'icon',
					// element-plus图标库，其他图标库 https://icon-sets.iconify.design
					enabledCollections: ['ep'],
					// 自定义icon集合
					customCollections: ['svg'],
					// 当图标集名字过长时，可使用集合别名
					// alias: {
					// 	system: 'system-uicons',
					// },
				}),

				// 自动导入 Element Plus 组件
				// { importStyle: 'sass' }
				ElementPlusResolver(),
			],
			include: [
				/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
				/\.vue$/,
				/\.vue\?vue/, // .vue
				/\.md$/, // .md
			],
			globs: [
				// 匹配所有components文件夹下的 .vue 文件
				'**/components/**/*.vue',
			],
		}),
		Icons({
			// 自动安装：import IconBaseline5g from '~icons/ic/baseline-5g'
			autoInstall: true,
			customCollections: {
				svg: FileSystemIconLoader('src/assets/icon', svg =>
					svg.replace(/^<svg /, '<svg fill="currentColor" '),
				),
			},
		}),
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		},
	},
	// css: {
	// 	preprocessorOptions: {
	// 		scss: {
	// 			additionalData: `@use "@/styles/modules/theme.scss" as *;`,
	// 		},
	// 	},
	// },
	// server: {
	// 	proxy: {
	// 		// '/iwater': {
	// 		// 	target: 'http://wz-iwater-server.test.eslink.net.cn/',
	// 		// 	changeOrigin: true,
	// 		// },
	// 	},
	// },
	build: {
		target: 'es2015',
		minify: true,
	},
})
