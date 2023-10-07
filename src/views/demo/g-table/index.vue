<script setup>
const tableRef = ref(null)

const data = ref([
	{
		userNo: 111,
		userName: '用户号1',
		cardNo: 111,
	},
	{
		userNo: 222,
		userName: '用户号2',
		cardNo: 222,
	},
	{
		userNo: 333,
		userName: '用户号3',
		cardNo: 333,
	},
	{
		userNo: 444,
		userName: '用户号4',
		cardNo: 444,
	},
	{
		userNo: 555,
		userName: '用户号5',
		cardNo: 555,
	},
])
const columns = ref([
	{
		type: 'selection',
		width: 60,
	},
	{
		type: 'index',
		width: 60,
		label: '序号',
	},
	{
		prop: 'userNo',
		label: '用户号',
	},
	{
		prop: 'userName',
		label: '用户名称',
		columns: [
			{
				prop: 'age',
				label: '年龄',
			},
			{
				prop: 'sex',
				label: '性别',
			},
		],
	},
	{
		prop: 'cardNo',
		label: '表卡编号',
	},
	{
		prop: 'deal',
		label: '操作',
		width: 100,
	},
])

const handleSelectionChange = data => {
	console.log('🚀 ~ file: index.vue:54 ~ handleSelectionChange ~ data:', data)
}
const handleEdit = rowData => {
	console.log('🚀 ~ file: index.vue:76 ~ handleEdit ~ rowData:', rowData)
}
</script>

<template lang="pug">
.g-form-demo
	g-table(
		ref='tableRef',
		:data='data',
		:columns='columns',
		border,
		stripe,
		@selection-change='handleSelectionChange'
	)
		template(#deal='{ row }')
			el-button(v-blur, type='primary', size='small', @click='handleEdit(row)') 编辑
</template>

<style lang="scss" scoped>
.g-form-demo {
	padding: 12px;
	height: 100%;
}
</style>
