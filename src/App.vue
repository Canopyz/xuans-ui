<script setup lang="ts">
import { ref } from 'vue'
import Button from './components/Button/Button.vue'
import Collapse from './components/Collapse/Collapse.vue'
import CollapseItem from './components/Collapse/CollapseItem.vue'
import Icon from './components/Icon/Icon.vue'
import Alert from './components/Alert/Alert.vue'

const openedValues = ref(['a'])
</script>

<template>
  <Button icon="arrow-up" loading>test</Button>
  <Button icon="arrow-down">test</Button>
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
  <Icon icon="arrow-up" size="2x" color="#fedcba" />
  <Alert
    show-icon
    type="danger"
    title="test"
    description="This is a short description"
  />
</template>

<style scoped></style>
