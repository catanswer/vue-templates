<template lang="pug">
el-form.form(ref='formRef', v-bind='$attrs', :model='form', @submit.native.prevent)
	el-row(:gutter='gutter')
		el-col(
			v-for='(item, index) in dataComp',
			v-show='!expandedIndex || index <= expandedIndex',
			:span='$attrs.inline ? 24 : item.col ?? 6'
		)
			el-form-item(
				:key='item.key',
				:label='`${item.label}${labelColon ? "：" : ""}`',
				:prop='item.key',
				:rules='item.rules',
				v-bind='item.itemProps',
				style='position: relative'
			)
				el-input(
					v-if='item.component === "el-input"',
					v-model.trim='form[item.key]',
					v-bind='item.props',
					v-on='item.events || {}'
				)
					template(v-for='slot in getSlotsByKey(item.key)', #[slot])
						slot(:name='`${item.key}-${slot}`')
				el-input-number(
					v-else-if='item.component === "el-input-number"',
					v-model.number='form[item.key]',
					v-bind='item.props'
				)
				el-select(
					v-else-if='item.component === "el-select" && Array.isArray(item.options)',
					v-model='form[item.key]',
					v-bind='item.props',
					v-on='item.events || {}'
				)
					template(v-for='slot in getSlotsByKey(item.key)', #[slot])
						slot(:name='`${item.key}-${slot}`')
					el-option(
						v-for='o in item.options',
						:key='o.value',
						:disabled='o.disabled',
						:label='o.label',
						:value='o.value'
					)
						template(v-for='slot in getSlotsByKey(item.key, "option")')
							slot(:name='slot', :data='o')
				el-checkbox-group(
					v-else-if='item.component === "el-checkbox" && Array.isArray(item.options)',
					v-model='form[item.key]',
					v-bind='item.props',
					v-on='item.events || {}'
				)
					el-checkbox(v-for='o in item.options', :key='o.value', :label='o.label', :value='o.value')
				el-radio-group(
					v-else-if='item.component === "el-radio" && Array.isArray(item.options)',
					v-model='form[item.key]',
					v-bind='item.props',
					v-on='item.events || {}'
				)
					el-radio(v-for='o in item.options', :key='o.value', :label='o.value') {{ o.label }}
				component(
					v-else,
					:is='compoents[item.component]',
					v-model='form[item.key]',
					v-bind='item.props',
					v-on='item.events || {}'
				)
				template(#label='{ label }', v-if='item.desc')
					.desc
						div {{ label }}
						el-tooltip(placement='right', :content='item.desc')
							//- icon-ep-question-filled
							question-filled
				//- 自定义组件
				slot(v-if='item.slot', :name='item.slot')
				//- 上传组件
				//- 收起状态 - 使用跑马灯切换
				el-carousel.carousel(
					v-if='item.component === "el-upload" && form[item.key].length > 0 && item.imgListFold',
					height='78px',
					arrow='hover',
					:autoplay='false',
					indicator-position='none'
				)
					el-carousel-item(v-for='(img, index) in form[item.key]', :key='index')
						el-button.remove(
							v-if='!($attrs.disabled || item.props?.disabled)',
							v-blur,
							:disabled='$attrs.disabled || item.props?.disabled',
							@click='handleRemoveImg(item.key, index)'
						)
							el-icon(color='#fff', size='14')
								//- icon-ep-delete
								delete
						el-image(
							:src='form[item.key][index].url',
							:preview-src-list='form[item.key].map(it => it.url)',
							preview-teleported
						)
				//- 展开状态 - 图片平铺展示
				.image-list(
					v-if='item.component === "el-upload" && form[item.key].length > 0 && !item.imgListFold'
				)
					.image-list-item(v-for='(img, index) in form[item.key]', :key='index')
						el-button.remove(
							v-if='!($attrs.disabled || item.props?.disabled)',
							v-blur,
							:disabled='$attrs.disabled || item.props?.disabled',
							@click='handleRemoveImg(item.key, index)'
						)
							el-icon(color='#fff', size='14')
								//- icon-ep-delete
								delete
						el-image(
							:src='form[item.key][index].url',
							:preview-src-list='form[item.key].map(it => it.url)',
							preview-teleported,
							:initial-index='imgPreviewIndex',
							@click='imgPreviewIndex = index'
						)
				el-upload(
					v-if='item.component === "el-upload" && !($attrs.disabled || item.props?.disabled)',
					v-model:file-list='form[item.key]',
					:disabled='$attrs.disabled || item.props?.disabled',
					:show-file-list='false',
					list-type='picture-card',
					v-bind='item.props',
					v-on='item.events || {}',
					style='margin-bottom: 12px'
				)
					template(#trigger)
						el-button.upload-button(
							v-blur,
							:disabled='$attrs.disabled || item.props?.disabled',
							:style='{ backgroundColor: $attrs.disabled || item.props?.disabled ? "#f4f5fb" : "" }'
						)
							.icon
								el-icon(v-blur, :size='20')
									//- icon-ep-circle-plus
									circle-plus
								.text {{ item.props?.text || '上传图片' }}
				slot(:name='`${item.key}-left`')
		slot
</template>

<script setup>
import {
	ElSwitch,
	ElCascader,
	ElDatePicker,
	ElTimePicker,
	ElTimeSelect,
	ElSlider,
	ElTreeSelect,
} from 'element-plus'
import 'element-plus/es/components/switch/style/css'
import 'element-plus/es/components/cascader/style/css'
import 'element-plus/es/components/date-picker/style/css'
import 'element-plus/es/components/time-picker/style/css'
import 'element-plus/es/components/time-select/style/css'
import 'element-plus/es/components/slider/style/css'
import 'element-plus/es/components/tree-select/style/css'
import { QuestionFilled, Delete, CirclePlus } from '@element-plus/icons-vue'

const compoents = shallowReactive({
	'el-switch': ElSwitch,
	'el-cascader': ElCascader,
	'el-date-picker': ElDatePicker,
	'el-time-picker': ElTimePicker,
	'el-time-select': ElTimeSelect,
	'el-slider': ElSlider,
	'el-tree-select': ElTreeSelect,
})

const props = defineProps({
	// v-model绑定值
	modelValue: { type: Object, required: true },
	// formItem数据
	data: { type: Array, required: true },
	expandedIndex: {
		type: Number,
		required: false,
	},
	// 是否自动在 label 名称后添加冒号
	labelColon: {
		type: Boolean,
		default: false,
	},
	// 表单项横向间距
	gutter: {
		type: Number,
		default: 16,
	},
})

const dataComp = computed(() => {
	return props.data.filter(item => item.show ?? true)
})

// 获取父组件所有slot的数据 进行处理
const { slots } = getCurrentInstance()
const getSlotsByKey = (key, subkey = '') => {
	return Object.keys(slots)
		.map(item => {
			const [keyValue = '', nameValue = '', slotName = ''] = item.split('-')
			if (subkey) {
				if (keyValue === key && nameValue === subkey) {
					return item
				}
			} else {
				if (keyValue === key) {
					return nameValue
				}
			}
		})
		.filter(Boolean)
}

const emits = ['update:modelValue']

const formRef = ref()
const form = computed({
	get() {
		return props.modelValue
	},
	set(value) {
		emits('update:modelValue', value)
	},
})
// 验证表单项数据是否完整
const verifyIntegrity = () => {
	const keys = []
	for (const item of props.data) {
		if (!item.component && !item.slot) {
			console.warn('Warning：data中缺少component字段')
			break
		}
		if (!item.key) {
			console.warn('Warning：data中缺少key字段')
			break
		}

		if (keys.includes(item.key)) {
			console.warn('Warning：data中有重复key')
		} else {
			keys.push(item.key)
		}
	}
}
onMounted(() => {
	// generateRules()
	verifyIntegrity()
})

// 表单验证
const validate = async () => await unref(formRef)?.validate()
// 验证具体的某个字段
const validateField = key => {
	return new Promise(resolve => {
		unref(formRef)?.validateField(key, valid => {
			resolve(valid)
		})
	})
}
// 重置表单
const resetForm = () => unref(formRef)?.resetFields()
// 移除该表单项的校验结果
const clearValidate = () => unref(formRef)?.clearValidate()

// 获取表单数据
const getFormData = async () => {
	if (JSON.stringify(rules.value) !== '{}') {
		const valid = await validate()
		return valid ? toRaw(form.value) : { valid }
	}
	return toRaw(form.value)
}

const imgPreviewIndex = ref(0)
// 删除图片
const handleRemoveImg = (key, index) => {
	form.value[key].splice(index, 1)
}

defineExpose({
	formRef,
	resetForm,
	clearValidate,
	getFormData,
	validate,
	validateField,
})
</script>

<style lang="scss" scoped>
.form {
	--el-disabled-text-color: #3f435e;
	--el-disabled-bg-color: #f6f7fa;
	--el-border-radius-base: 6px;
	--el-text-color-regular: #5f627d;
	.el-form-item {
		margin-bottom: 20px;
	}
	:deep {
		.el-input,
		.el-select {
			flex: 1;
		}
	}
}
.desc {
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.carousel {
	width: 78px;
	height: 78px;
	border: 1px solid #e1e2ec;
	border-radius: 4px;
	margin-right: 12px;
	overflow: hidden;
	:deep {
		.el-carousel__container {
			&:hover {
				.remove {
					top: 0;
				}
			}
		}
		.el-carousel__arrow {
			background-color: rgba(0, 0, 0, 0.3);
			&:hover {
				background-color: rgba(0, 0, 0, 0.6);
			}
		}
		.el-carousel__arrow--left {
			width: 20px;
			height: 20px;
			left: 0;
		}
		.el-carousel__arrow--right {
			width: 20px;
			height: 20px;
			right: 0;
		}
		.el-image {
			height: 100%;
			width: 100%;
		}
	}
}
.image-list {
	display: flex;
	flex-wrap: wrap;
	.image-list-item {
		position: relative;
		width: 78px;
		height: 78px;
		overflow: hidden;
		margin-right: 12px;
		margin-bottom: 12px;
		&:hover {
			.remove {
				top: 0;
			}
		}
		:deep {
			.el-image {
				width: 100%;
				height: 100%;
			}
		}
	}
}
.remove {
	position: absolute;
	z-index: 9;
	top: -26px;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 26px;
	height: 26px;
	padding: 0;
	border-radius: 0 4px;
	transition: all 0.3s;
	border: none;
	background-color: rgba(0, 0, 0, 0.3);
	&:hover {
		background-color: rgba(0, 0, 0, 0.6);
	}
}
.upload-button {
	width: 78px;
	height: 78px;
	border-radius: 4px;
	border: 1px solid #e1e2ec;
	.icon {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 78px;
		padding: 16px 0;
		margin-top: 10px;
		.text {
			color: #9a9cb0;
			font-size: 12px;
			line-height: 30px;
		}
	}
}
:deep {
	.el-date-editor,
	.el-cascader,
	.el-select {
		width: 100%;
		.el-select__tags > span {
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
		.el-input .el-input__inner {
			height: var(--el-input-inner-height) !important;
		}
	}
	.el-input {
		display: inline-flex;
	}

	.el-upload--picture-card {
		width: 100%;
		height: 100%;
		border: none;
	}
}
</style>
