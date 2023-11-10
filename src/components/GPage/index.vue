<script setup>
const props = defineProps({
	loading: Boolean,
	search: {
		type: Object,
		default: () => {
			return {
				model: {},
				data: [],
			}
		},
	},
	hideSearch: {
		type: Boolean,
		default: false,
	},
	table: {
		type: Object,
		default: () => {
			return {
				data: [],
				columns: [],
			}
		},
	},
	pagination: {
		type: Object,
		default: () => {
			return {
				total: 0,
				pageNum: 1,
				pageSize: 10,
			}
		},
	},
})
const emits = defineEmits(['refresh', 'update:pagination'])

// 搜索条件
const formRef = ref()
// 重置
const handleReset = () => {
	formRef.value.resetForm()
	emits('refresh', 1)
}

// 分页
const paginationComp = computed({
	get() {
		return props.pagination
	},
	set(value) {
		emits('update:pagination', value)
	},
})
</script>

<template lang="pug">
.page-container(v-loading='loading')
	//- 搜索条件
	.page-search(v-if='!hideSearch')
		g-form(v-bind='search', ref='formRef', v-model='search.model', :data='search.data')
			el-button(v-blur, type='primary', @click='emits("refresh", 1)') 查询
			el-button(v-blur, @click='handleReset') 重置
				slot(name='search-start')
		slot(name='search-end')
	//- 中间地带
	slot(name='between')
	//- 表格
	g-table(v-bind='$attrs', :columns='table.columns', :data='table.data')
		template(
			v-for='column in table.columns',
			v-show='column.prop',
			#[column.prop]='{ row, index }'
		)
			slot(:name='column.prop', :row='row', :column='column', :index='index')
	//- 分页
	g-pagination(v-bind='pagination', v-model='paginationComp', @pagination='emits("refresh")')
</template>

<style lang="scss" scoped>
.page-container {
	display: flex;
	flex-direction: column;
	padding: 12px;
	width: 100%;
	height: 100%;
	overflow: auto;
}
.page-search {
	display: flex;
	align-items: center;
	justify-content: space-between;
	.form {
		flex: 1;
	}
}
</style>
