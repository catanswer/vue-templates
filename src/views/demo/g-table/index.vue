<script setup>
const pageLoading = ref(false)
// 搜索条件
const search = ref({
	model: { name: '', age: 1, sex: '1' },
	data: [
		{
			show: true,
			key: 'userNo',
			label: '用户号',
			component: 'el-input',
			props: { placeholder: '请输入用户号' },
		},
		{
			show: true,
			key: 'cardNo',
			label: '表卡编号',
			component: 'el-input',
			props: { placeholder: '请输入表卡编号' },
		},
		{
			show: true,
			key: 'name',
			label: '姓名',
			component: 'el-input',
			props: { placeholder: '请输入姓名' },
		},
		{
			key: 'age',
			label: '年龄',
			component: 'el-input',
			props: { placeholder: '请输入年龄', clearable: true },
		},
		{
			key: 'sex',
			label: '性别',
			component: 'el-select',
			props: { placeholder: '请选择性别', clearable: true },
			options: [
				{
					label: '男',
					value: 1,
				},
				{
					label: '女',
					value: 0,
				},
			],
		},
	],
})
// 表格
const table = ref({
	columns: [
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
	],
	data: [
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
	],
})
// 分页
const page = ref({
	total: 100,
	pageNum: 1,
	pageSize: 10,
})

const handleSelectionChange = data => {
	console.log('🚀 ~ file: index.vue:54 ~ handleSelectionChange ~ data:', data)
}
const handleEdit = rowData => {
	console.log('🚀 ~ file: index.vue:76 ~ handleEdit ~ rowData:', rowData)
}

const handleGetTableData = async () => {
	pageLoading.value = true
	try {
		setTimeout(() => {
			pageLoading.value = false
		}, 1000)
	} catch (error) {
		pageLoading.value = false
	}
}
</script>

<template lang="pug">
g-page(
	:loading='pageLoading',
	:search='search',
	:table='table',
	v-model:pagination='page',
	@selection-change='handleSelectionChange',
	@refresh='handleGetTableData'
)
	template(#between)
		.between
			el-button(v-blur, type='primary') 新增
	template(#deal='{ row }')
		el-button(v-blur, type='primary', size='small', @click='handleEdit(row)') 编辑
</template>

<style lang="scss" scoped>
.g-form-demo {
	display: flex;
	flex-direction: column;
	padding: 12px;
	height: 100%;
}
.between {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin-bottom: 12px;
}
</style>
