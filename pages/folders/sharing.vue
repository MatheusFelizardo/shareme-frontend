<template>
  <div class="pt-8 px-4 relative overflow-hidden h-full">
    <Breadcrumb :links="links" />

    <div v-if="sharedFolders.length > 0" class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 mt-8 pb-4 overflow-y-auto max-h-[calc(100svh-130px)]">
      <div v-for="folder in sharedFolders" :key="folder.id"  class="relative flex bg-gray-200 px-4 py-2 shadow-md justify-between overflow-hidden text-black">
        <router-link 
            class="w-full"
            :to="`/folders/${folder.id}?origin=sharing`" 
            @click="$folderStore.setSelectedFolder(folder)"
          >
          <div class="flex items-center gap-4 w-10/12">
            <div>
              <svg v-if="!folder.is_shared" focusable="false" viewBox="0 0 24 24" height="24px" width="24px" fill="rgb(99 102 241)" class="a-s-fa-Ha-pa"><g><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path><path d="M0 0h24v24H0z" fill="none"></path></g></svg>

              <svg v-else focusable="false" viewBox="0 0 24 24" height="24px" width="24px" fill="rgb(34 197 94)" class=""><g><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path><path d="M0 0h24v24H0z" fill="none"></path></g></svg>
            </div>

            <div class="truncate">{{ folder.name }}</div>
          </div>
        </router-link>
        <div class="absolute right-2 cursor-pointer">
          <FolderDropdown :folder="folder">
            <svg viewBox="0 0 20 20" focusable="false" class=" c-qd a-s-fa-Ha-pa" width="20px" height="20px" fill="currentColor"><path fill="none" d="M0 0h20v20H0V0z"></path><path d="M10 6c.82 0 1.5-.68 1.5-1.5S10.82 3 10 3s-1.5.67-1.5 1.5S9.18 6 10 6zm0 5.5c.82 0 1.5-.68 1.5-1.5s-.68-1.5-1.5-1.5-1.5.68-1.5 1.5.68 1.5 1.5 1.5zm0 5.5c.82 0 1.5-.67 1.5-1.5 0-.82-.68-1.5-1.5-1.5s-1.5.68-1.5 1.5c0 .83.68 1.5 1.5 1.5z"></path></svg>
          </FolderDropdown>
        </div>
      </div>
    </div>

    <div v-else class="flex mt-8 pb-6 pointer-events-none">
      <p>You are not sharing any folder.</p>
    </div>
  </div>
</template>

<script setup>
  definePageMeta({
    layout: 'authenticated',
    breadcrumb: "Sharing"
  })

  const links = ref([
    {
    name: 'Home',
    path: '/folders',
    folder: null
    },
    {
    name: 'Sharing',
    path: '/folders/sharing',
    folder: null
    }
  ])

  import FolderDropdown from '~/components/Folder/FolderDropdown.vue';
  import SpinIcon from '../assets/img/icons/SpinIcon.vue';
  import Breadcrumb from '~/components/Menu/Breadcrumb.vue';
  import { storeToRefs } from 'pinia';
  const { $folderStore } = useNuxtApp()

  const { sharedFolders } = storeToRefs($folderStore)

</script>

<style lang="scss" scoped>
  
</style>