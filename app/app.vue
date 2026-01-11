<script setup lang="ts">
import axios from 'axios';
import { reactive } from 'vue';

const credentials = reactive({
  email:"",
  password:""
})

const itemTitle = reactive({
  title:""
})

const createItem = async() =>{
  try {
    const response = await axios.post("http://localhost:9999/api/items", itemTitle, {
      withCredentials: true // This sends cookies for session auth
    })
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
} 

async function login(){
  try {
    const response = await axios.post("http://localhost:9999/api/auth/sign-in/email", credentials, {
      withCredentials: true // This receives and stores the session cookie
    })
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div>
    <div>login</div>
    <form @submit.prevent="login" action="post">
      <input v-model="credentials.email" type="text" name="email">
      <input v-model="credentials.password" type="text" name="password">
      <button type="submit">login</button>
    </form>
  </div>
  <div>
    <div>create item</div>
    <form @submit.prevent="createItem" action="post">
      <input v-model="itemTitle.title" type="text" name="title">
      <button type="submit">create</button>
    </form>
  </div>
</template>
