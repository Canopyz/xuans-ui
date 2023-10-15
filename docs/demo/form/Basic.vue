<script setup>
import Form from '@/components/Form/Form.vue'
import FormItem from '@/components/Form/FormItem.vue'
import Input from '@/components/Input/Input.vue'
import Button from '@/components/Button/Button.vue'
import { reactive, ref } from 'vue'

const rules = {
  email: [
    { required: true, message: 'Please enter the email', trigger: 'blur' },
    { type: 'email', message: 'Please enter the correct email', trigger: 'change' },
  ],
  password: [
    { required: true, message: 'Please enter the password' },
    { min: 6, message: 'The password must be at least 6 characters' },
  ],
}
const model = reactive({
  email: '',
  password: '',
})

const formRef = ref()

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
  } catch (err) {}
}
</script>

<template>
  <div>
    <Form :model="model" :rules="rules" ref="formRef">
      <FormItem label="the email" prop="email">
        <Input v-model="model.email" />
      </FormItem>
      <FormItem label="the password" prop="password">
        <Input type="password" v-model="model.password" />
      </FormItem>
      <FormItem>
        <Button type="primary" @click.prevent="handleSubmit">Submit</Button>
        <Button @click.prevent="() => formRef.resetFields()">Reset</Button>
        <Button @click.prevent="() => formRef.clearValidations()">clear</Button>
      </FormItem>
    </Form>
  </div>
</template>

<style></style>
