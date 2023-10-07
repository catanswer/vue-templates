<script setup>
import GTableColumn from './components/GTableColumn.vue'

const props = defineProps({
	loading: Boolean,
	// 数据列若无数据 默认显示 '--'
	defaultRowValue: {
		type: [Number, String],
		default: '--',
	},
	columns: Array,
})

const tableRef = ref(null)
// 滚动条置顶
const setScrollTop = top => {
	tableRef.value.setScrollTop(top)
}

defineExpose({
	tableRef,
	setScrollTop,
})
</script>

<template lang="pug">
el-table(v-bind='$attrs', v-loading='loading', ref='tableRef', :height='$attrs.height || "100%"')
	g-table-column(
		v-for='column in columns',
		:column='column',
		:default-row-value='defaultRowValue'
	)
		template(#[column.prop]='scope')
			slot(:name='column.prop', :data='scope', :row='scope.row', :index='scope.$index')
</template>

<style lang="scss" scoped></style>
