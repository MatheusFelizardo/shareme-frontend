

<template>
  <div>
    <DropdownMenuRoot v-model:open="toggleState">
      <DropdownMenuTrigger aria-label="Folder options">
        <slot />
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent 
          align="start" 
          class="z-40 min-w-[220px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          :side-offset="5"
        >
          <DropdownMenuItem @click="handleDownload" class="flex px-2 py-1 items-center gap-2 cursor-pointer hover:bg-indigo-200">
            <svg viewBox="0 0 24 24" width="24px" height="24px"><path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3zm-1-4-1.41-1.41L13 12.17V4h-2v8.17L8.41 9.59 7 11l5 5z"></path></svg>
            <DropdownMenuLabel>Download</DropdownMenuLabel>
          </DropdownMenuItem>

          <DropdownMenuSeparator class="h-[0.5px] bg-indigo-300 my-1"  />

          <DropdownMenuItem @click="showFileInfo = true" class="flex px-2 py-1 items-center gap-2 cursor-pointer hover:bg-indigo-200">
            <svg viewBox="0 0 24 24" width="24px" height="24px"><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8"></path></svg>
            <DropdownMenuLabel>Info</DropdownMenuLabel>
          </DropdownMenuItem>

          <DropdownMenuSeparator  v-if="!isPublic" class="h-[0.5px] bg-indigo-300 my-1"  />
          
          <DropdownMenuItem v-if="!isPublic" @click="showRenameFile = true" class="flex px-1 py-1 items-center gap-3 cursor-pointer hover:bg-indigo-200">
            <svg width="24px" height="24px" viewBox="0 0 24 24"><path d="M18.41 5.8 17.2 4.59c-.78-.78-2.05-.78-2.83 0l-2.68 2.68L3 15.96V20h4.04l8.74-8.74 2.63-2.63c.79-.78.79-2.05 0-2.83M6.21 18H5v-1.21l8.66-8.66 1.21 1.21zM11 20l4-4h6v4z"></path></svg>
            <DropdownMenuLabel>Rename</DropdownMenuLabel>
          </DropdownMenuItem>

          <DropdownMenuSeparator  v-if="!isPublic" class="h-[0.5px] bg-indigo-300 my-1"  />

         

          <DropdownMenuItem v-if="!isPublic" @click="showDeleteFile = true" class="flex px-1 py-1 items-center gap-3 cursor-pointer hover:bg-indigo-200">
            <svg width="24px" height="24px" viewBox="0 0 24 24"><path d="M16 9v10H8V9zm-1.5-6h-5l-1 1H5v2h14V4h-3.5zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2z"></path></svg>
            <DropdownMenuLabel>Delete</DropdownMenuLabel>
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>

    <FileInfo :file="props.file" :showFileInfo="showFileInfo" :close="() => showFileInfo = false" />
    <RenameFile :file="props.file" :showRenameFile="showRenameFile" :close="() => showRenameFile = false" />
    <DeleteFile :file="props.file" :showDeleteFile="showDeleteFile" :close="() => showDeleteFile = false" />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from 'radix-vue'
import FileInfo from '~/components/File/FileInfo.vue'
import RenameFile from '~/components/File/RenameFile.vue'
import DeleteFile from '~/components/File/DeleteFile.vue'


const props = defineProps({
  file: Object,
  folder: Object
})

const route = useRoute()
const isPublic = ref(route.path.includes('public'))
const { $folderStore } = useNuxtApp()
const file = ref(props.file)

const toggleState = ref(false)
const showFileInfo = ref(false)
const showRenameFile = ref(false)
const showDeleteFile = ref(false)

const handleDownload = async () => {
  await $folderStore.downloadFile(props.file)
}


</script>