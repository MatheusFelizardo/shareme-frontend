<template>
  <aside
    class="h-full border-r-[0.5px] border-r-gray-100 relative pt-4 min-w-[210px]"
  >
    <router-link to="/folders" class="text-white">
      <div class="flex w-full justify-center mb-8">
        <Logo />
      </div>
    </router-link>

    <nav class="bg-gray-800 text-white p-4 flex flex-col">
      <New />

      <div class="flex flex-col gap-4">
        <router-link
          class="text-sm text-white flex items-center gap-4 py-1 px-3 rounded-full fill-white"
          active-class="text-indigo-500 font-semibold !fill-indigo-500 !text-indigo-500"
          to="/folders"
        >
          <svg height="24" width="24" viewBox="0 0 24 24" focusable="false">
            <g><path d="M0,0h24v24H0V0z" fill="none"></path></g>
            <g>
              <polygon
                points="12,3 4,9 4,21 10,21 10,14 14,14 14,21 20,21 20,9"
              ></polygon>
            </g>
          </svg>
          <span>Home</span>
        </router-link>

        <router-link
          class="text-sm text-white flex items-center gap-4 py-1 px-3 rounded-full fill-white"
          active-class="text-indigo-500 font-semibold !fill-indigo-500 !text-indigo-500"
          to="/folders/sharing"
        >
          <svg width="24px" height="24px" viewBox="0 0 24 24" focusable="false">
            <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2m-5 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m4 8h-8v-1c0-1.33 2.67-2 4-2s4 .67 4 2z"></path>
          </svg>
          <span>Sharing</span>
        </router-link>

        <router-link
          class="text-sm text-white flex items-center gap-4 py-1 px-3 rounded-full fill-white"
          active-class="text-indigo-500 font-semibold !fill-indigo-500 !text-indigo-500"
          to="/folders/shared-with-me"
        >
          <svg width="24px" height="24px" viewBox="0 0 24 24" ><path d="M3 6H1v13c0 1.1.9 2 2 2h17v-2H3z"></path><path d="M21 4h-7l-2-2H7c-1.1 0-1.99.9-1.99 2L5 15c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2"></path></svg>
          <span>Shared with me</span>
        </router-link>

        <router-link
          class="text-sm text-white flex items-center gap-4 py-1 px-3 rounded-full fill-white"
          active-class="text-indigo-500 font-semibold !fill-indigo-500 !text-indigo-500"
          to="/users"
        >
          <svg width="24px" height="24px" viewBox="0 0 24 24" focusable="false">
            <g><rect fill="none" height="24" width="24"></rect></g>
            <g>
              <g>
                <path
                  d="M15,8c0-1.42-0.5-2.73-1.33-3.76C14.09,4.1,14.53,4,15,4c2.21,0,4,1.79,4,4s-1.79,4-4,4c-0.43,0-0.84-0.09-1.23-0.21 c-0.03-0.01-0.06-0.02-0.1-0.03C14.5,10.73,15,9.42,15,8z M16.66,13.13C18.03,14.06,19,15.32,19,17v3h4v-3 C23,14.82,19.42,13.53,16.66,13.13z M9,4c2.21,0,4,1.79,4,4s-1.79,4-4,4s-4-1.79-4-4S6.79,4,9,4z M9,13c2.67,0,8,1.34,8,4v3H1v-3 C1,14.34,6.33,13,9,13z"
                ></path>
              </g>
            </g>
          </svg>
          <span>Users</span>
        </router-link>

        <router-link
          v-if="user.role === 'admin'"
          class="text-sm text-white flex items-center gap-4 py-1 px-3 rounded-full fill-white"
          active-class="text-indigo-500 font-semibold !fill-indigo-500 !text-indigo-500"
          to="/register"
        >
          <svg width="24px" height="24px" viewBox="0 0 24 24" focusable="false">
            <g><rect fill="none" height="24" width="24"></rect></g>
            <g>
              <g>
                <path
                  d="M15,8c0-1.42-0.5-2.73-1.33-3.76C14.09,4.1,14.53,4,15,4c2.21,0,4,1.79,4,4s-1.79,4-4,4c-0.43,0-0.84-0.09-1.23-0.21 c-0.03-0.01-0.06-0.02-0.1-0.03C14.5,10.73,15,9.42,15,8z M16.66,13.13C18.03,14.06,19,15.32,19,17v3h4v-3 C23,14.82,19.42,13.53,16.66,13.13z M9,4c2.21,0,4,1.79,4,4s-1.79,4-4,4s-4-1.79-4-4S6.79,4,9,4z M9,13c2.67,0,8,1.34,8,4v3H1v-3 C1,14.34,6.33,13,9,13z"
                ></path>
              </g>
            </g>
          </svg>
          <span>Register</span>
        </router-link>
      </div>
    </nav>

    <div class="absolute bottom-0 w-full">
      <div class="text-xs mb-4 flex flex-col items-center justify-center">
        <p class="mb-1"><span>Logged as: {{ user.name }} </span> <span>{{ user.lastName }} </span></p>
        <p class="text-indigo-300">({{ user.email }})</p>
      </div>

      <button
        @click="logout"
        class=" bg-red-500 text-white py-2 px-4 w-full text-center hover:bg-red-400"
      >
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import New from "./Menu/New.vue";
import { storeToRefs } from 'pinia';

const { $userStore } = useNuxtApp()
const { user } = storeToRefs($userStore)

const logout = () => {
  localStorage.removeItem("jwtToken");
  navigateTo("/");
};
</script>

<style lang="scss" scoped></style>
