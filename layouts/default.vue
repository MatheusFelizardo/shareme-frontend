<template>
  <div>
    <div v-if="isLoading" class="w-full h-full flex justify-center pt-20 relative bg-gray-800 text-white min-h-screen">
      <div class="flex flex-col items-center justify-center gap-2 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        <div class="mb-10 flex w-full justify-center">
          <Logo />
        </div>
        
        <SpinIcon class="w-10 h-10 animate-spin text-white" />
        <p>Loading...</p>
      </div>
    </div>
    <div v-else class="relative bg-gray-800 text-white min-h-screen">
      <main>
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
  import SpinIcon from './assets/img/icons/SpinIcon.vue';

const { $userStore } = useNuxtApp()
const isLoading = ref(true);

onMounted(async () => {
  const hasUser = await $userStore.userLogin();
  if (hasUser) {
    navigateTo('/folders')
    setTimeout(()=> {
      isLoading.value = false;
    }, 200);
    return
  }
  
  localStorage.removeItem('jwtToken');
  navigateTo('/')
  setTimeout(() => {
    isLoading.value = false;
  }, 200);
});

</script>