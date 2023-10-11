<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import type { TooltipInstance } from './components/Tooltip/types'
import Button from './components/Button/Button.vue'
import Collapse from './components/Collapse/Collapse.vue'
import CollapseItem from './components/Collapse/CollapseItem.vue'
import Icon from './components/Icon/Icon.vue'
import Alert from './components/Alert/Alert.vue'
// import Tooltip from './components/Tooltip/Tooltip.vue'
import Dropdown from './components/Dropdown/Dropdown'
import Message from './components/Message/Message.vue'
import { createMessage } from './components/Message'

const openedValues = ref(['a'])
const tooltip = ref<TooltipInstance | null>(null)

onMounted(() => {
  console.log(tooltip.value)
  const instance = createMessage({
    type: 'error',
    message: 'test',
    duration: 3000,
    showClose: true,
  })
  createMessage({
    type: 'info',
    message: 'test2',
    duration: 3000,
  })
  createMessage({
    type: 'success',
    message: 'test3',
    duration: 3000,
  })

  setTimeout(() => {
    instance.destroy()
  }, 1000)
})
</script>

<template>
  <Button icon="arrow-up" @click="tooltip?.show">test</Button>
  <Button icon="arrow-down" @click="tooltip?.hide">test</Button>
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
  <Alert show-icon type="danger" title="test" description="This is a short description" />
  <!-- <Tooltip -->
  <!--   placement="top" -->
  <!--   trigger="hover" -->
  <!--   ref="tooltip" -->
  <!--   :popper-options="{ placement: 'right' }" -->
  <!-- > -->
  <!--   <img -->
  <!--     src="./assets/logo.svg" -->
  <!--     alt="" -->
  <!--     style="width: 125px; height: 125px" -->
  <!--   /> -->
  <!--   <template #content>test</template> -->
  <!-- </Tooltip> -->
  <Dropdown
    placement="right"
    trigger="hover"
    ref="tooltip"
    :popper-options="{ placement: 'right' }"
    :menu-options="[
      {
        key: 1,
        label: h('b', 'This is bold'),
      },
      {
        key: 2,
        label: 'item2',
        disabled: true,
      },
      {
        key: 3,
        label: 'item1',
        divided: true,
      },
      {
        key: 4,
        label: 'item4',
      },
    ]"
    @visible-change="(value) => console.log('visible change', value)"
    @select="(item) => console.log('select', item)"
  >
    <img src="./assets/logo.svg" alt="" style="width: 125px; height: 125px" />
    <template #content>test</template>
  </Dropdown>
</template>

<style scoped></style>
