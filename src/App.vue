<template>
    <div class="red">app</div>
    <el-button type="primary">{{ count }}</el-button>
</template>
<script setup>
import { ref } from 'vue';

const count = ref(0)

</script>
<style scoped>
.app-vue {
    color: red;
}
</style>