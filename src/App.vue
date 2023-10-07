<template lang="pug">
el-config-provider(:locale='locale')
	router-view
</template>

<script setup>
import zhCN from 'element-plus/dist/locale/zh-cn.mjs'
const locale = ref(zhCN)
</script>

<style lang="scss">
#app {
	width: 100%;
	height: 100%;
}
</style>
