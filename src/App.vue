<template>
    <div class="app-vue">app</div>
    <el-button type="primary" @click="handleClick">{{ count }}</el-button>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const count = ref(0)

const handleClick = () => {
    console.log('++++111223332----')
    count.value++
}

</script>
<style lang="scss" scoped>
.app-vue {
    color: red;
}
</style>