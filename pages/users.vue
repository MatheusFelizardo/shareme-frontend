<template>
  <div class="pt-8 px-4 relative overflow-hidden h-full">
    <Breadcrumb :links="links" />

    <div v-if="isLoading">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pt-5">
        <SpinIcon class=" animate-spin text-indigo-500" />
      </div>
    </div>
    <div v-else>
      <div class="mt-8 pb-4 max-h-[calc(100%-110px)] overflow-auto">
        <div v-if="users.length > 0">
          <div v-for="user in users" :key="user" class="">
            <div class="flex items-center mb-2 gap-8">
              <span class="w-3/12 truncate">{{ user.name }}</span>
              <span :class="loggedUser.role === 'admin' ? 'w-7/12 truncate' : 'w-7/12 truncate'">{{ user.email }}</span>
              <div :class="loggedUser.role === 'admin' ? 'w-2/12 flex gap-1' : 'w-2/12'">
                <router-link  :to="`/folders/_public/${user.email}?origin=users`">
                  <svg class="fill-white hover:fill-indigo-500" width="24px" height="24px" viewBox="0 0 24 24"  ><path d="M10.09 15.59 11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2"></path></svg>
                </router-link>
  
                <div v-if="loggedUser.role === 'admin'" class="flex gap-1">
                  <button @click="showEditUser = user">
                    <svg class="fill-white hover:fill-indigo-500" width="24px" height="24px" viewBox="0 0 24 24" ><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"></path></svg>
                  </button>
  
                  <button @click="showDeleteUser = user">
                    <svg class="fill-white hover:fill-red-500" width="24px" height="24px" viewBox="0 0 24 24" ><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"></path></svg>
                  </button>
                </div>
              </div>
            </div>
  
            <DeleteUser :user="showDeleteUser" :showDeleteUser="showDeleteUser" :close="() => showDeleteUser = false" />
  
            <Teleport to="body" v-if="showEditUser">
              <div
                class="fixed inset-0 bg-black/30 z-[9999] flex items-center justify-center"
              >
                <div
                  class="z-[9999] absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-md max-w-[300px] w-full"
                >
                  <p class="text-xs mb-4">Selected the role for {{ showEditUser.name }} </p>
                  
  
                  <div class="flex gap-2 justify-between">
                    <div class="flex gap-2">
                      <button
                        @click="changeRole(showEditUser, 'admin')"
                        class="bg-gray-400 text-xs text-white p-1 px-2 min-w-[40px] hover:bg-indigo-500"
                      >
                        Admin
                      </button>
                      <button
                        @click="changeRole(showEditUser, 'user')"
                        class="bg-gray-400 text-xs text-white p-1 px-2 min-w-[40px] hover:bg-indigo-500"
                      >
                        User
                      </button>
                    </div>
        
                    <button class="bg-red-500 text-xs text-white p-1 px-2 min-w-[40px] hover:bg-red-400" @click="showEditUser = null;">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </Teleport> 
          </div>
        </div>
        <div v-else>
          <p>No users found</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import Breadcrumb from '~/components/Menu/Breadcrumb.vue';
import DeleteUser from '~/components/User/DeleteUser.vue';
import SpinIcon from '~/assets/img/icons/SpinIcon.vue';

definePageMeta({
  layout: 'authenticated',
  breadcrumb: "Users"
})

const links = ref([
  {
  name: 'Home',
  path: '/folders',
  folder: null
  },
  {
  name: `Users`,
  path: `/users`,
  folder: null
  }
])

const { $userStore } = useNuxtApp();
const { users, user: loggedUser } = storeToRefs($userStore);
const showDeleteUser = ref(false);
const showEditUser = ref(false);
const isLoading = ref(true);

const changeRole = async (user, role) => {
  const response = await $userStore.editUserRole(user.id, role);
  showEditUser.value = false;
}

onMounted(async () => {
  await $userStore.getAllUsers();
  isLoading.value = false;
})

</script>

<style>
</style>