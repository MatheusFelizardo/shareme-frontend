<template>
  <div class="pt-8 px-4 relative overflow-hidden h-full">
    <Breadcrumb :links="links" />

    <div v-if="isLoading">
      <div class="pt-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <SpinIcon class="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    </div>

    <div v-else>
      <div v-if="publicFolders.length > 0" class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 mt-8 pb-4 overflow-y-auto max-h-[calc(100svh-130px)]">
      <div v-for="folder in publicFolders" :key="folder.id" :title="folder.name" class="relative flex bg-gray-200 px-4 py-2 shadow-md justify-between overflow-hidden text-black">
        <router-link 
            class="w-full"
            :to="`/folders/_public/${email}/${folder.id}?origin=users`" 
            @click="$folderStore.setSelectedFolder(folder)"
          >
          <div class="flex items-center gap-4 w-10/12">
            <div>
              <svg v-if="!folder.is_shared" focusable="false" viewBox="0 0 24 24" height="24px" width="24px" fill="rgb(99 102 241)" ><g><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path><path d="M0 0h24v24H0z" fill="none"></path></g></svg>

              <svg v-if="folder.is_shared && user.id === folder.creator_id" focusable="false" viewBox="0 0 24 24" height="24px" width="24px" fill="rgb(34 197 94)" class=""><g><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path><path d="M0 0h24v24H0z" fill="none"></path></g></svg>
              <svg v-if="folder.is_shared && user.id !== folder.creator_id" focusable="false" viewBox="0 0 24 24" height="24px" width="24px" fill="rgb(234 179 8)" class=""><g><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path><path d="M0 0h24v24H0z" fill="none"></path></g></svg>
            </div>

            <div class="truncate">{{ folder.name }}</div>
          </div>
        </router-link>
      </div>
      </div>

      <div v-else class="flex flex-col mt-8 pb-4 ">
        <p><span class="text-indigo-500">{{ userInfo.name }}</span> doesn't have any file on public folder.</p>
      </div>
    </div>

    
  </div>
</template>

<script setup>
  definePageMeta({
    layout: 'authenticated'
  })

  import FolderDropdown from '~/components/Folder/FolderDropdown.vue';
  import SpinIcon from '../assets/img/icons/SpinIcon.vue';
  import Breadcrumb from '~/components/Menu/Breadcrumb.vue';
  import CreateFolderModal from '~/components/Folder/CreateFolderModal.vue';

  import { storeToRefs } from 'pinia';

  const { $folderStore, $userStore } = useNuxtApp()
  const { users } = storeToRefs($userStore)
  const route = useRoute()
  const isLoading = ref(true)
  const publicFolders = ref([])
  const email  = route.params.email
  const userInfo = computed(() => {
    return users.value.find(user => user.email === email)
  })

  const origin = route.query.origin;

  const links = computed(() => {
    const breadcrumbLinks = [
      {
        name: "Home",
        path: "/folders",
        folder: null,
      },
    ];

    if (origin === "users") {
      breadcrumbLinks.push({
        name: 'Users',
        path: `/users`,
        folder: null,
      });
    }

    breadcrumbLinks.push({
      name: `${email}`,
      path: `/folders/_public/${email}${origin ? `?origin=${origin}` : ""}`,
      folder: null
    });

    return breadcrumbLinks;
  });

  const oppenedDropdown = ref(null)
  const showCreateFolder = ref(false)

  onMounted(async () => {
    const publicFoldersResponse =  await $folderStore.getPublicFolders(email)
    publicFolders.value = publicFoldersResponse
    isLoading.value = false
  })
</script>

<style lang="scss" scoped>
  
</style>