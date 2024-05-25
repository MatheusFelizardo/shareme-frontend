<template>
  <div class="relative bg-gray-800 text-white min-h-screen">
    <NuxtLoadingIndicator throttle="0" color="rgb(99 102 241)" />

  
    <main class="flex gap-2 h-full">
      <div class="basis-2/12 pt-1">
        <NavMenu />
      </div>
      <div class="basis-10/12 pt-1 relative">
        <div class="absolute bottom-2 flex gap-8 left-4 items-center">
          <p class="text-xs flex gap-1 items-center">
            <span class="w-3 h-3 rounded-full bg-gray-500"></span>
            Private folders
          </p>

          <p class="text-xs flex gap-1 items-center">
            <span class="w-3 h-3 rounded-full bg-indigo-500"></span>
            Public folders
          </p>

          <p class="text-xs flex gap-1 items-center">
            <span class="w-3 h-3 rounded-full bg-green-500"></span>
            You shared
          </p>
          <p class="text-xs flex gap-1 items-center">
            <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
            Shared with you
          </p>
        </div>
    
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import NavMenu from '~/components/Menu/NavMenu.vue';

const { $userStore } = useNuxtApp()

onMounted(async () => {
  const hasUser = await $userStore.userLogin();
  
  if (hasUser) {
    return
  }
  
  localStorage.removeItem('jwtToken');
  navigateTo('/')
});

</script>