<script setup>
const props = defineProps({
	column: Object,
	// 数据列若无数据 默认显示 '--'
	defaultRowValue: {
		type: [Number, String],
		default: '--',
	},
})
</script>

<template lang="pug">
el-table-column(
	v-bind='column',
	:align='column.align || "center"',
	:prop='column.type ? "" : column.prop'
)
	template(#default='{ row, $index }')
		//- 定义每一列的插槽 外部使用Page时 可以直接使用插槽定义每一列
		slot(
			v-if='column.type !== "selection" && column.prop',
			:name='column.prop',
			:row='row',
			:column='column',
			:index='$index'
		)
			| {{ row[column.prop] || [0, '0'].includes(row[column.prop]) ? row[column.prop] : defaultRowValue }}
		template(v-if='column.columns && column.columns.length > 0')
			g-table-column(v-for='(item, index) in (column.columns || [])', :key='index', :column='item')
</template>
