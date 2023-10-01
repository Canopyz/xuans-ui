<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ButtonInstance } from './components/Button/types'
import Button from './components/Button/button.vue'

const button = ref<ButtonInstance>()
onMounted(() => {
  if (button.value) {
    console.log('buttonRef', button.value.ref)
  }
})
</script>

<template>
  <Button type="primary" round ref="button"> 123 </Button>
  <Button type="danger"> 123 </Button>
  <Button type="info"> 123 </Button>
  <Button type="success"> 123 </Button>
  <Button type="warning"> 123 </Button>
  <br />
  <a href="">link</a>
  <h1>Test</h1>
  <h2>Test</h2>
  <h3>Test</h3>
  <hr />
</template>

<style scoped></style>
