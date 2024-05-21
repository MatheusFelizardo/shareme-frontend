
<template>
  <div>
    <MenubarRoot 
      v-model="currentMenu" 
      class="text-white border border-indigo-400 rounded-md py-1 transition-all hover:bg-indigo-500 text-center mb-8">
      <MenubarMenu value="new">
        <MenubarTrigger
        
          class="w-full h-full flex items-center justify-center cursor-pointer"
        >
          New
        </MenubarTrigger>
        <MenubarPortal>
          <MenubarContent
            class="min-w-[220px] outline-none bg-gray-800 border text-white border-gray-200 rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] [animation-duration:_400ms] [animation-timing-function:_cubic-bezier(0.16,_1,_0.3,_1)] will-change-[transform,opacity]"
            align="start"
            :side-offset="8"
            :align-offset="-3"
          >
            <MenubarItem
              @click="createModalVisible = true"
              class="h-full w-full cursor-pointer p-2 flex gap-2 items-center transition-all hover:bg-indigo-200 hover:text-indigo-500"
            >
              <svg width="24px" height="24px" viewBox="0 0 24 24" focusable="false" fill="currentColor"><path d="M12 12h2v-2h2v2h2v2h-2v2h-2v-2h-2v-2zm10-4v10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2l.01-12c0-1.1.89-2 1.99-2h6l2 2h8c1.1 0 2 .9 2 2zm-2 0H4v10h16V8z"></path></svg>
              <span>New folder</span>
            </MenubarItem>

            <MenubarSeparator class="h-[1px] bg-gray-300 m-[5px]" />
            <MenubarItem
              class="h-full w-full cursor-pointer p-2 flex gap-2 items-center transition-all hover:bg-indigo-200 hover:text-indigo-500"
              @click="showFileUpload = true"
            >
              <svg width="24px" height="24px" viewBox="0 0 24 24" focusable="false" fill="currentColor"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10zM8 13.01l1.41 1.41L11 12.84V17h2v-4.16l1.59 1.59L16 13.01 12.01 9 8 13.01z"></path></svg>
              <span>File upload</span>
            </MenubarItem>
          </MenubarContent>
        </MenubarPortal>
      </MenubarMenu>
    </MenubarRoot>

    <CreateFolderModal :closeModal="()=> createModalVisible = false" :open="createModalVisible" />
    <UploadFile :close="()=> showFileUpload = false" :showFileUpload="showFileUpload" />
    
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import {
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarItemIndicator,
    MenubarMenu,
    MenubarPortal,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarRoot,
    MenubarSeparator,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
  } from 'radix-vue'
  import CreateFolderModal from '../Folder/CreateFolderModal.vue';
  import UploadFile from '../Folder/UploadFile.vue';

  const currentMenu = ref('')
  const createModalVisible = ref(false)
  const showFileUpload = ref(false)
 
</script>
