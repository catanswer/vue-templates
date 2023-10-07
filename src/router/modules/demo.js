export default [
	{
		path: '/g-form',
		name: 'GForm',
		component: () => import('@/views/demo/g-form/index.vue'),
		meta: {
			title: 'GForm',
		},
	},
	{
		path: '/g-table',
		name: 'GTable',
		component: () => import('@/views/demo/g-table/index.vue'),
		meta: {
			title: 'GTable',
		},
	},
]
