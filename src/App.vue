<template>
    <div :class="count">appss</div>
    <el-button type="primary" @click="handleClick">{{ count }}</el-button>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios'
const count = ref('red')
axios.defaults.baseURL = '/api'
axios.get('user').then(res => console.log(res,'resss'))

const handleClick = () => {
    count.value = count.value === 'red' ? 'app-vue' : 'red'
}

</script>
<style lang="scss" scoped>
.app-vue {
    color: blue;
}
</style>