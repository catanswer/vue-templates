<script setup>
const props = defineProps({
	modelValue: {
		type: Object,
		default: () => {
			return { pageNum: 1, pageSize: 10, total: 0 }
		},
	},
	pagerCount: {
		type: Number,
		default: 5,
	},
	pageSizes: {
		type: Array,
		default: () => [10, 20, 30, 50],
	},
	layout: {
		type: String,
		default: 'total, sizes, prev, pager, next, jumper',
	},
	align: {
		type: String,
		default: 'right',
	},
	hidden: {
		type: Boolean,
		default: false,
	},
})
const emits = defineEmits(['pagination'])

const alignText = computed(() => {
	switch (props.align) {
		case 'left':
			return 'flex-start'
		case 'center':
			return 'center'
		case 'right':
			return 'flex-end'
		default:
			return 'flex-right'
	}
})

const handleChange = () => {
	emits('pagination', props.modelValue)
}
</script>

<template lang="pug">
.pagination(v-show='!hidden', :style='{ "justify-content": alignText }')
	el-pagination(
		v-bind='$attrs',
		v-model:current-page='modelValue.pageNum',
		v-model:page-size='modelValue.pageSize',
		:total='modelValue.total',
		:pager-count='pagerCount',
		:page-sizes='pageSizes',
		:layout='layout',
		@current-change='handleChange',
		@size-change='handleChange'
	)
</template>

<style lang="scss" scoped>
.pagination {
	display: flex;
	align-items: center;
	padding-top: 12px;
}
:deep(.el-select) {
	.el-input {
		width: 100px;
	}
}
</style>
