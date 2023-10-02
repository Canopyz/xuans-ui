<script setup lang="ts">
import { ref } from 'vue'
import Collapse from './components/Collapse/Collapse.vue'
import CollapseItem from './components/Collapse/CollapseItem.vue'

const openedValues = ref(['a'])
</script>

<template>
  <Collapse v-model="openedValues" accordion>
    <CollapseItem name="a">
      <template #title>
        <h1>nice title</h1>
      </template>
      <h1>headline title</h1>
      <div>this is content</div>
    </CollapseItem>
    <CollapseItem name="b" title="nice title b item b">
      <div>this is bbbbb test</div>
    </CollapseItem>
    <CollapseItem name="c" title="nice title c item c" disabled>
      <div>this is cc test</div>
    </CollapseItem>
  </Collapse>
  {{ openedValues }}
</template>

<style scoped></style>
