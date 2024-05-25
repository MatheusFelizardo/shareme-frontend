<template>
  <div class="w-full h-full flex justify-center pt-20">
    <div class="w-10/12 max-w-96">
      <div class="mb-10 flex w-full justify-center">
        <Logo />
      </div>
      <h1 class="text-2xl font-light mb-6">Login</h1>
      <form @submit.prevent="login">
        <div class="mb-4 relative">
          <span class="text-xs text-red-500 absolute right-1 top-1" :v-if="error.email">{{  error.email }}</span>
          <label for="email" class="block text-gray-300">Email</label>
          <input type="email" id="email" 
          @input="()=> {
            error.email = ''
            error.response = ''
          }" 
          v-model="form.email" class="w-full mt-1 p-2 border border-gray-300 rounded text-black">
        </div>
        <div class="mb-8 relative">
          <span class="text-xs text-red-500 absolute right-1 top-1" :v-if="error.password">{{  error.password }}</span>
          <label for="password" class="block text-gray-300 ">Password</label>
          <input 
          type="password" 
          id="password"  
          @input="()=> {
            error.password = ''
            error.response = ''
          }" 
          v-model="form.password" class="w-full mt-1 p-2 border border-gray-300 rounded text-black">
        </div>
        <div class="relative">
          <span class="text-xs text-red-500 absolute -top-5" :v-if="error.response">{{  error.response }}</span>
          <button 
            :disabled="loading" 
            type="submit" 
            class="w-full  text-white p-2 rounded relative"
            :class="loading ? 'cursor-not-allowed bg-indigo-300' : 'cursor-pointer bg-indigo-500'"
          >
            Login
            <SpinIcon v-if="loading" class="animate-spin absolute right-2 top-2" />
          </button>
        </div>

        <div class="text-white text-xs mt-2 text-right"> 
          Don't have an account? 
          <router-link to="/register" class="text-indigo-300 text-semibold transition-all hover:text-indigo-500">Register</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
  import SpinIcon from '../assets/img/icons/SpinIcon.vue';
  import { storeToRefs } from 'pinia';
  const { $userStore } = useNuxtApp()

 
  const loading = ref(false);
  const error = ref({
    email: '',
    password: '',
    response: ''
  })

  const form = ref({
    email: '',
    password: ''
  });

  const login = async () => {
    if (form.value.email === '') {
      error.value.email = 'Email is required';
      return;
    }

    if (form.value.password === '') {
      error.value.password = 'Password is required';
      return;
    }

    loading.value = true;
    const data = await $userStore.login(form.value.email, form.value.password);
    loading.value = false;
    
    if (data.success) {
      error.value.response = '';
      navigateTo('/folders')
      return
    }

    loading.value = false;
    error.value.response = 'Invalid credentials. Please contact the system administrator';
  };



</script>

<style>
</style>SpinIcon