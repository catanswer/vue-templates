<script setup>
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
const columnsComp = computed(() => {
	return props.columns.filter(item => {
		return !!(item.show === undefined) || item.show
	})
})
// 滚动条置顶
const setScrollTop = (top = 0) => {
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
		v-for='column in columnsComp',
		:column='column',
		:default-row-value='defaultRowValue'
	)
		template(#[column.prop]='{ row, index }')
			slot(:name='column.prop', :row='row', :column='column', :index='index')
</template>

<style lang="scss" scoped></style>
