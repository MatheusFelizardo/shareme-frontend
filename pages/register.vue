<template>

  <div class="w-full h-full flex justify-center pt-20">
    <div class="w-10/12 max-w-96">
      <div class="mb-10 flex w-full justify-center">
        <Logo />
      </div>
      
      <h1 class="text-2xl font-light mb-6">Register</h1>

      <form @submit.prevent="register" class="text-black">
        <div class="mb-4 relative">
          <span class="text-[10px] absolute top-0 right-0 text-red-500">{{ errors.name }}</span>
          <label for="name" class="block text-gray-300 text-xs">Name</label>
          <input @input="resetStates()" required type="name" id="name" v-model="form.name" class="border-indigo-500 text-xs w-full mt-1 p-2 border">
        </div>

        <div class="mb-4 relative">
          <span class="text-[10px] absolute top-0 right-0 text-red-500">{{ errors.lastName }}</span>
          <label for="lastName" class="block text-gray-300 text-xs">Last name</label>
          <input @input="resetStates()" required type="lastName" id="lastName" v-model="form.lastName" class="border-indigo-500 text-xs w-full mt-1 p-2 border">
        </div>

        <div class="mb-4 relative hidden">
          <span class="text-[10px] absolute top-0 right-0 text-red-500">{{ errors.role }}</span>

          <label for="role" class="block text-gray-300 text-xs">Role</label>
          <select @change="successMessage = ''" required type="role" id="role" v-model="form.role" class="border-indigo-500 text-xs w-full mt-1 p-2 border">
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        <div class="mb-4 relative">
          <span class="text-[10px] absolute top-0 right-0 text-red-500">{{ errors.email }}</span>

          <label for="email" class="block text-gray-300 text-xs">Email</label>
          <input @input="resetStates()" required type="email" id="email" v-model="form.email" class="border-indigo-500 text-xs w-full mt-1 p-2 border">
        </div>
        <div class="mb-8 relative">
          <span class="text-[10px] absolute top-0 right-0 text-red-500">{{ errors.password }}</span>
          <label for="password" class="block text-gray-300 text-xs">Password</label>
          <input @input="resetStates()" required type="password" id="password" v-model="form.password" class="border-indigo-500 text-xs w-full mt-1 p-2 border">
        </div>
        <div class="relative">
          <span class="text-xs absolute -bottom-10 left-0 text-red-500">{{ errors.response }}</span>
          <span class="text-xs absolute -bottom-10 left-0 text-green-500">{{ successMessage }}</span>
          <button :disabled="isCreating" type="submit" class="w-full bg-indigo-500 text-white p-2 rounded">
            Create account
            <SpinIcon v-if="isCreating" class="animate-spin absolute right-2 top-2" />
          </button>
        </div>
      </form>

      <div class="text-white text-xs mt-2 text-right"> 
        Click here to 
        <router-link to="/" class="text-indigo-300 text-semibold transition-all hover:text-indigo-500">Login</router-link>
      </div>
    </div>
  </div>

    
   
</template>

<script setup>
import { ref } from 'vue';
import SpinIcon from '~/assets/img/icons/SpinIcon.vue';
import Breadcrumb from '~/components/Menu/Breadcrumb.vue';

const { $userStore } = useNuxtApp();

const isCreating = ref(false);
const form = ref({
  email: '',
  password: '',
  name: '',
  lastName: '',
  role: 'user'
});

const errors = ref({
  email: '',
  password: '',
  name: '',
  lastName: '',
  role: '',
  response: ''
});

const successMessage = ref('');

const register = async () => {
  isCreating.value = true;
  const data = {
    email: form.value.email,
    password: form.value.password,
    name: form.value.name,
    lastName: form.value.lastName,
    role: form.value.role
  };

  if (data.password.length < 8) {
    errors.value.password = 'Password must have at least 8 characters'
    isCreating.value = false;
    return;
  }

  const registerResponse = await $userStore.createAccount(data);
  if (!registerResponse.error) {
    successMessage.value = 'Account created successfully';
    form.value.email = '';
    form.value.password = '';
    form.value.name = '';
    form.value.lastName = '';
    form.value.role = 'user';

    setTimeout(async ()=> {
      const login = await $userStore.login(data.email, data.password);
      if (login.success) {
        navigateTo('/folders');
      }
    }, 1000)
    
  } else {
    errors.value.response = registerResponse.message;
  }

  isCreating.value = false;
};

const resetStates = () => {
  errors.value.email = '';
  errors.value.password = '';
  errors.value.name = '';
  errors.value.lastName = '';
  errors.value.role = '';
  errors.value.response = '';
  successMessage.value = '';
  isCreating.value = false;
};

</script>

<style>
</style>