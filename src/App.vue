<template>
    <div :class="count">appss说是 s</div>
    <el-button type="primary" @click="handleClick">{{ count }}</el-button>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const count = ref('red')

const handleClick = () => {
    count.value = count.value === 'red' ? 'app-vue' : 'red'
}

</script>
<style lang="scss" scoped>
.app-vue {
    color: blue;
}
</style>