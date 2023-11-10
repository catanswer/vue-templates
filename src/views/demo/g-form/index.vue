<template lang="pug">
.g-form-demo
	g-form(v-model='formData', :data='data')
		template(#children-suffix)
			span 个
	el-button(v-blur, type='primary') 123
</template>

<script setup>
const formData = ref({
	name: '',
	openStatus: 1,
	picture: [
		{
			name: 'food.jpeg',
			url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
		},
		{
			name: 'food.jpeg',
			url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
		},
	],
})

const handleBeforeUpload = file => {
	// 返回一个Promise
	console.log('🚀 ~ file: index.vue:127 ~ handleBeforeUpload ~ file:', file)
	return true
}

const data = ref([
	{
		key: 'name',
		label: '姓名',
		component: 'el-input',
		props: { placeholder: '请输入姓名' },
		rules: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
	},
	{
		key: 'children',
		label: '子女',
		slot: true,
		component: 'el-input',
		props: { placeholder: '请输入子女个数' },
		rules: [{ required: true, trigger: 'blur', message: '请输入子女个数' }],
	},
	{
		key: 'age',
		label: '年龄',
		component: 'el-input',
		props: { placeholder: '请输入年龄', clearable: true },
		rules: [{ required: true, trigger: 'blur', message: '请输入年龄' }],
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
		rules: [{ required: true, trigger: 'change', message: '请选择性别' }],
	},
	{
		key: 'marry',
		label: '是否结婚',
		component: 'el-switch',
		props: {},
	},
	{
		key: 'hobby',
		label: '兴趣爱好',
		component: 'el-checkbox',
		props: {},
		options: [
			{
				label: '篮球',
				value: 0,
			},
			{
				label: '足球',
				value: 1,
			},
			{
				label: '排球',
				value: 2,
			},
		],
	},
	{
		key: 'progress',
		label: '项目进度',
		component: 'el-slider',
		props: { showInput: true },
	},
	{
		key: 'openStatus',
		label: '是否开启',
		component: 'el-radio',
		props: {},
		options: [
			{
				label: '关闭',
				value: 0,
			},
			{
				label: '开启',
				value: 1,
			},
		],
	},
	{
		key: 'time',
		label: '时间',
		component: 'el-time-picker',
		props: {},
	},
	{
		key: 'date',
		label: '日期',
		component: 'el-date-picker',
		props: {},
	},
	{
		key: 'dateRange',
		label: '日期范围',
		component: 'el-date-picker',
		props: { type: 'daterange' },
	},
	{
		key: 'remark',
		label: '备注',
		component: 'el-input',
		props: { type: 'textarea' },
		desc: '123',
	},
	{
		key: 'picture',
		label: '站点图片',
		component: 'el-upload',
		props: {
			action: 'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15',
			accept: 'image/gif, image/jpeg, image/jpg, image/png',
			beforeUpload: handleBeforeUpload,
		},
	},
])
</script>

<style lang="scss" scoped>
.g-form-demo {
	padding: 12px;
}
</style>
