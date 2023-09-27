<template lang="pug">
el-form.form(ref='formRef', v-bind='$attrs', :model='form')
	el-row(:gutter='16')
		el-col(v-for='item in items', :span='$attrs.inline ? 24 : item.col ?? 6')
			el-form-item(
				:key='item.key',
				:label='`${item.label}${labelColon ? "：" : ""}`',
				:prop='item.key',
				:rules='item.rules',
				style='position: relative'
			)
				el-input(
					v-if='item.component === "el-input"',
					v-model.trim='form[item.key]',
					v-bind='item.props'
				)
				el-input-number(
					v-else-if='item.component === "el-input-number"',
					v-model.number='form[item.key]',
					v-bind='item.props'
				)
				el-select(
					v-else-if='item.component === "el-select" && Array.isArray(item.options)',
					v-model='form[item.key]',
					v-bind='item.props'
				)
					el-option(v-for='o in item.options', :key='o.value', :label='o.label', :value='o.value')
				el-checkbox-group(
					v-else-if='item.component === "el-checkbox" && Array.isArray(item.options)',
					v-model='form[item.key]',
					v-bind='item.props'
				)
					el-checkbox(v-for='o in item.options', :key='o.value', :label='o.label', :value='o.value')
				el-radio-group(
					v-else-if='item.component === "el-radio" && Array.isArray(item.options)',
					v-model='form[item.key]',
					v-bind='item.props'
				)
					el-radio(v-for='o in item.options', :key='o.value', :label='o.value') {{ o.label }}
				component(
					v-else,
					:is='compoents[item.component]',
					v-model='form[item.key]',
					v-bind='item.props'
				)
				template(#label='{ label }', v-if='item.desc')
					.desc
						div {{ label }}
						el-tooltip(placement='right', :content='item.desc')
							icon-ep-question-filled

				//- 上传组件
				el-carousel.carousel(
					v-if='item.component === "el-upload" && form[item.key].length > 0',
					height='78px',
					arrow='hover',
					:autoplay='false',
					indicator-position='none'
				)
					el-carousel-item(v-for='(img, index) in form[item.key]', :key='index')
						el-button.remove(
							v-blur,
							:disabled='item.disabled',
							@click='handleRemoveImg(item.key, index)'
						)
							el-icon(color='#fff', size='14')
								icon-ep-delete
						el-image(
							:src='form[item.key][index].url',
							:preview-src-list='form[item.key].map(it => it.url)',
							preview-teleported
						)
				el-upload(
					v-if='item.component === "el-upload"',
					v-model:file-list='form[item.key]',
					:disabled='$attrs.disabled || item.props.disabled',
					:show-file-list='false',
					v-bind='item.props'
				)
					template(#trigger)
						el-button.upload-button(
							v-blur,
							:disabled='item.disabled',
							:style='{ backgroundColor: item.disabled ? "#f4f5fb" : "" }'
						)
							.icon
								el-icon(v-blur, size='20')
									icon-ep-circle-plus
								.text 上传照片
</template>

<script setup>
import {
	ElSwitch,
	ElCascader,
	ElDatePicker,
	ElTimePicker,
	ElTimeSelect,
	ElSlider,
} from 'element-plus'
import 'element-plus/es/components/switch/style/css'
import 'element-plus/es/components/cascader/style/css'
import 'element-plus/es/components/date-picker/style/css'
import 'element-plus/es/components/time-picker/style/css'
import 'element-plus/es/components/time-select/style/css'
import 'element-plus/es/components/slider/style/css'

const compoents = shallowReactive({
	'el-switch': ElSwitch,
	'el-cascader': ElCascader,
	'el-date-picker': ElDatePicker,
	'el-time-picker': ElTimePicker,
	'el-time-select': ElTimeSelect,
	'el-slider': ElSlider,
})

const props = defineProps({
	// v-model绑定值
	modelValue: { type: Object, required: true },
	// formItem数据
	items: { type: Array, required: true },
	// 是否自动在 label 名称后添加冒号
	labelColon: {
		type: Boolean,
		default: true,
	},
})

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
// const rules = shallowRef({})

// 生成表单验证规则
// const generateRules = () => {
// 	const result = {}
// 	const hasRulesItems = props.items.filter(item => typeof item.rules !== 'undefined')
// 	hasRulesItems.forEach(item => {
// 		result[item.key] = item.rules
// 	})

// 	if (hasRulesItems.length > 0) {
// 		rules.value = result
// 	}
// }
// 验证表单项数据是否完整
const verifyIntegrity = () => {
	const keys = []
	for (const item of props.items) {
		if (!item.component) {
			console.warn('Warning：items中缺少component字段')
			break
		}
		if (!item.key) {
			console.warn('Warning：items中缺少key字段')
			break
		}

		if (keys.includes(item.key)) {
			console.warn('Warning：items中有重复key')
		} else {
			keys.push(item.key)
		}
		if (item.upload) {
			if (!item.upload.emits) {
				console.warn('Warning： uploader中缺少emits字段')
				break
			}
		}
	}
}
onMounted(() => {
	// generateRules()
	verifyIntegrity()
})

// 表单验证
const validate = () =>
	new Promise(resolve => {
		unref(formRef).validate(valid => resolve(valid))
	})
// 重置表单
const resetForm = () => unref(formRef)?.resetFields()
// 获取表单数据
const getFormData = async () => {
	if (JSON.stringify(rules.value) !== '{}') {
		const valid = await validate()
		return valid ? toRaw(form.value) : { valid }
	}
	return toRaw(form.value)
}

// 删除图片
const handleRemoveImg = (key, index) => {
	form.value[key].splice(index, 1)
}

defineExpose({
	formRef,
	resetForm,
	getFormData,
})
</script>

<style lang="scss" scoped>
.form {
	overflow: hidden;
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
	}
}
</style>
