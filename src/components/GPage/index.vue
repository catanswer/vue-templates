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
	hidePagination: {
		type: Boolean,
		default: false,
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

// 搜索条件slots search-operator-default
// search: 固定
// operator: 对应表单key
// option: 嵌套组件的name
// default: 对应表单的插槽名称
const { slots } = getCurrentInstance()
const searchSlots = computed(() => {
	return Object.keys(slots)
		.filter(item => {
			const [data1 = ''] = item.split('-')
			return data1 === 'search'
		})
		.map(item => {
			const [, data2, data3, data4] = item.split('-')
			return data4 ? `${data2}-${data3}-${data4}` : `${data2}-${data3}`
		})
})

// 分页
const paginationComp = computed({
	get() {
		return props.pagination
	},
	set(value) {
		emits('update:pagination', value)
	},
})

const tableRef = ref()
defineExpose({
	tableRef,
})
</script>

<template lang="pug">
.page-container(v-loading='loading')
	//- 搜索条件
	.page-search(v-if='!hideSearch')
		g-form(v-bind='search', ref='formRef', v-model='search.model', :data='search.data')
			el-button(v-blur, type='primary', @click='emits("refresh", 1)') 查询
			el-button(v-blur, @click='handleReset') 重置、
			template(v-for='searchSlot in searchSlots', #[searchSlot]='{ data }')
				slot(:name='`search-${searchSlot}`', :data='data')
			slot(name='search-start')
		slot(name='search-end')
	//- 中间地带
	slot(name='between')
	//- 表格
	g-table(ref='tableRef', v-bind='$attrs', :columns='table.columns', :data='table.data')
		template(
			v-for='column in table.columns',
			v-show='column.prop',
			#[column.prop]='{ row, index }'
		)
			slot(:name='column.prop', :row='row', :column='column', :index='index')
	//- 分页
	g-pagination(
		v-if='!hidePagination',
		v-bind='pagination',
		v-model='paginationComp',
		@pagination='emits("refresh")'
	)
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
	align-items: flex-start;
	justify-content: space-between;
	.form {
		flex: 1;
	}
}
</style>
